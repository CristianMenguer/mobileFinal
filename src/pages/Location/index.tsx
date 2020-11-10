import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import MapView, { Marker, Region } from 'react-native-maps'
import { Entypo as Icon } from '@expo/vector-icons'

import Loader from '../../components/Loader'
import useLocation from '../../hooks/location'
import { SetInfo } from '../../services/InfoStorage'

import Styles from './style'
import { AddCoordsDB, GetCoordByIdDB, LoadAllGeoLocationDB } from '../../models/Location'
import { showToast } from '../../services/ShowToast'
import useAllData from '../../hooks/allData'

const Location: React.FC = () => {

    const isFocused = useIsFocused()
    const { locationData } = useLocation()
    const { setLoading } = useAllData()

    const [currentCoord, setCurrentCoord] = useState({} as Coordinate)
    const [currentGeoLocation, setCurrentGeoLocation] = useState({} as GeoLocation)
    const [marks, setMarks] = useState<GeoLocation[]>([])
    const [region, setRegion] = useState<Region>(() => {
        console.log('initial')
        return {
            longitude: 0,
            latitude: 0,
            latitudeDelta: 0.014,
            longitudeDelta: 0.014
        } as Region
    })

    const colorSelected = '#FF0000bb'

    const colors = [
        //    'red',
        //    'tomato',

        'orange',
        'yellow',
        'green',
        'gold',
        'wheat',
        'linen',
        'tan',
        'blue',
        'aqua',
        'teal',
        'violet',
        'purple',
        'indigo',
        'turquoise',
        'navy',
        'plum'
    ]

    function LoadGeoLocation() {

        LoadAllGeoLocationDB()
            .then(data => {
                //
                let newMarks = marks
                //
                data.map(async (geo) => {

                    if (geo.coordId && locationData.coordId == geo.coordId) {
                        geo.coords = await GetCoordByIdDB(geo.coordId)
                        setCurrentGeoLocation(geo)
                    }
                    //
                    else
                        if (geo.coordId && newMarks.filter(mark => mark.id == geo.id).length == 0) {
                            geo.coords = await GetCoordByIdDB(geo.coordId)
                            newMarks.push(geo)

                        }
                })
                //
                setMarks(newMarks)
            })
    }

    useEffect(() => {
        //
        if (!isFocused)
            return
        //
        showToast('Drag and drop the red pointer to change the location!')
        //
        const newRegion: Region = {
            latitudeDelta: 0.014,
            longitudeDelta: 0.014,
            latitude: locationData.coords?.latitude ? locationData.coords?.latitude : 0,
            longitude: locationData.coords?.longitude ? locationData.coords?.longitude : 0,
        }
        setRegion(newRegion)
        if (locationData.coords)
            setCurrentCoord(locationData.coords)
        //
        LoadGeoLocation()
        //
    }, [isFocused])

    function removeMarker(id: number) {

        Alert.alert(
            'Delete Location',
            `Are you sure you want to delete ${id}?`,
            [
                {
                    text: 'No',
                    onPress: () => console.log('No')
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        let newMarks = []

                        for (let item of marks)
                            if (item.id !== id)
                                newMarks.push(item)
                        //
                        setMarks(newMarks)
                    }
                }
            ],
            { cancelable: false }
        )

    }

    async function addMarker() {
        if (currentCoord.id && currentCoord.id > 0) {
            showToast('Erro ao salvar. Location already saved!')
            return
        }

        const savedCoords = await AddCoordsDB({ latitude: currentCoord.latitude, longitude: currentCoord.longitude })
        //
        if (!savedCoords.id || savedCoords.id < 1) {
            showToast('Erro ao salvar. Please, try again!')
            return
        }
        //
        await SetInfo({
            key: 'CurrentCoord',
            value: JSON.stringify(savedCoords)
        })

        Alert.alert(
            'Saved Location',
            'New location saved. Would you like to reload the app with this new location?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No')
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        showToast('App is reloading...', 'center', 'long')
                        setTimeout(() => setLoading(true), 1000)
                    }
                }
            ],
            { cancelable: false }
        )

    }

    useEffect(() => {
        console.log(region)
    }, [region.latitude])

    if (!currentCoord || !currentCoord.latitude)
        return <Loader message={'Loading map...'} />

    return (
        <View style={Styles.container} >
            <View style={Styles.mapContainer} >
                <MapView style={Styles.map}
                    initialRegion={{
                        latitude: currentCoord.latitude,
                        longitude: currentCoord.longitude,
                        latitudeDelta: 0.014,
                        longitudeDelta: 0.014
                    }}
                    // onRegionChange={newRegion => {
                    //     console.log(newRegion)
                    // }}
                    onRegionChange={newRegion => setRegion.bind(newRegion)}
                    region={region}

                >
                    <Marker
                        draggable
                        onDragEnd={(e) => {
                            setCurrentCoord({ id: 0, ...e.nativeEvent.coordinate })
                        }}
                        coordinate={currentCoord}
                        pinColor={colorSelected}
                    />
                    {
                        marks.map(marker => {
                            return (
                                <Marker
                                    key={marker.id}
                                    // @ts-ignore
                                    coordinate={{ latitude: marker.coords.latitude, longitude: marker.coords.longitude }}
                                    pinColor={colors[((marker.id ? marker.id : 0) - 1) % colors.length]}

                                />
                            )
                        }
                        )
                    }

                </MapView>
            </View>

            <View style={Styles.itemsContainer} >
            <Text style={Styles.itemTitle} >My Locations</Text>
            <Text
                //style={Styles.itemTitle}
            >(press to focus; long press to delete)</Text>
                <ScrollView
                    horizontal
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    <View style={Styles.item}  >
                        <TouchableOpacity onPress={() => addMarker()} style={Styles.addButton} >
                            <Icon name='add-to-list' size={64} color={'#505050'} />
                            <Text style={Styles.addText} >Add Current Location</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{ ...Styles.item, backgroundColor: colorSelected }}
                        onPress={() => setRegion(oldRegion => {
                            const newRegion: Region = {
                                latitude: currentGeoLocation.coords?.latitude,
                                longitude: currentGeoLocation.coords?.longitude,
                                latitudeDelta: oldRegion.latitudeDelta,
                                longitudeDelta: oldRegion.longitudeDelta
                            }

                            return newRegion
                        })}
                    >
                        <Text style={Styles.itemText} >{currentGeoLocation.city}</Text>
                        <Text style={Styles.itemText} >{currentGeoLocation.flag}</Text>
                        <Text style={Styles.descriptionText} >{currentGeoLocation.coords?.latitude.toFixed(2) + ', ' + currentGeoLocation.coords?.longitude.toFixed(2)}</Text>
                    </TouchableOpacity>

                    {
                        marks.map(mark => {
                            return (
                                <TouchableOpacity
                                    key={mark.id}
                                    style={{ ...Styles.item, backgroundColor: colors[((mark.id ? mark.id : 0) - 1) % colors.length] }}
                                    delayLongPress={750}
                                    onPress={() => setRegion(oldRegion => {
                                        const newRegion: Region = {
                                            latitude: mark.coords?.latitude,
                                            longitude: mark.coords?.longitude,
                                            latitudeDelta: oldRegion.latitudeDelta,
                                            longitudeDelta: oldRegion.longitudeDelta
                                        }

                                        return newRegion
                                    })}
                                    onLongPress={() => removeMarker(mark.id ? mark.id : 0)}
                                >
                                    <Text style={Styles.itemText} >{mark.city}</Text>
                                    <Text style={Styles.itemText} >{mark.flag}</Text>
                                    <Text style={Styles.descriptionText} >{mark.coords?.latitude.toFixed(2) + ', ' + mark.coords?.longitude.toFixed(2)}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }



                </ScrollView>
            </View>


        </View>
    )
}

export default Location
