import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import MapView, { Marker } from 'react-native-maps'
import { Entypo as Icon } from '@expo/vector-icons'
import * as Updates from 'expo-updates'

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
    const [marks, setMarks] = useState<GeoLocation[]>([])

    const colors = [
//        'red',
//        'tomato',
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
                let newMarks: GeoLocation[] = []
                //
                data.map(async (geo) => {

                    if (geo.coordId && (locationData.coordId != geo.coordId)) {
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
        //console.log(locationData)
        //
        showToast('Drag and drop the red pointer to change the location!')
        //
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
                        //setTimeout(() => Updates.reloadAsync(), 1000)
                        setTimeout(() => setLoading(true), 1000)
                    }
                }
            ],
            { cancelable: false }
        )

    }

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
                    loadingEnabled={!currentCoord.latitude}

                >
                    <Marker
                        draggable
                        title={'Current'}
                        description={'Drag to'}
                        onDragEnd={(e) => {
                            setCurrentCoord({id: 0, ...e.nativeEvent.coordinate})
                        }}

                        onDragStart={(e) => {
                            //console.log('dragStart: ')
                            //console.log(e.nativeEvent.coordinate)
                        }}
                        coordinate={currentCoord}
                        pinColor={colors[0]}
                    />
                    {
                        marks.map(marker => {
                            return (
                                <Marker
                                    key={marker.id}
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

                    {
                        marks.map(mark => {
                            return (
                                <TouchableOpacity
                                    key={mark.id}
                                    style={{...Styles.item, backgroundColor: colors[((mark.id ? mark.id : 0) - 1) % colors.length] }}
                                    delayLongPress={750}
                                    onLongPress={() => removeMarker(mark.id ? mark.id : 0)}
                                >
                                    <Text style={Styles.itemText} >{mark.country + ' ' + mark.flag}</Text>
                                    <Text style={Styles.descriptionText} >{mark.city}</Text>
                                    <Text style={Styles.descriptionText} >Coords:</Text>
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
