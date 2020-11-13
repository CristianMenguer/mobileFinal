import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import MapView, { Marker, Region } from 'react-native-maps'
import { Entypo as Icon } from '@expo/vector-icons'
import * as Updates from 'expo-updates'

import Loader from '../../components/Loader'
import useLocation from '../../hooks/location'
import { SetInfo } from '../../services/InfoStorage'

import Styles from './style'
import { AddCoordsDB, DeleteGeoLocationDB, GetCoordByIdDB, LoadAllGeoLocationDB } from '../../models/Location'
import { showToast } from '../../services/ShowToast'

const Location: React.FC = () => {

    const isFocused = useIsFocused()
    const { locationData } = useLocation()

    const [newCoord, setNewCoord] = useState({} as Coordinate)
    const [marks, setMarks] = useState<GeoLocation[]>([])
    const [region, setRegion] = useState<Region>(() => {
        return {
            longitude: 0,
            latitude: 0,
            latitudeDelta: 0.014,
            longitudeDelta: 0.014
        } as Region
    })

    const colorCurrent = '#FF0000bb'

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
                    if (geo.coordId && (!geo.coords || !geo.coords.latitude || !geo.coords.longitude))
                        geo.coords = await GetCoordByIdDB(geo.coordId)
                    //
                    if (newMarks.filter(mark => mark.id == geo.id).length == 0)
                        newMarks.push(geo)
                    //
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
        setNewCoord({} as Coordinate)
        //
        showToast('Long press on the map to set a new location!')
        //
        const newRegion: Region = {
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
            latitude: locationData.coords?.latitude ? locationData.coords?.latitude : 0,
            longitude: locationData.coords?.longitude ? locationData.coords?.longitude : 0,
        }
        setRegion(newRegion)
        //
        LoadGeoLocation()
        //
    }, [isFocused])

    function removeMarker(geo: GeoLocation) {

        if (!geo || !geo.id || geo.id < 1)
            return

        const id = geo.id

        Alert.alert(
            'Delete Location',
            `Are you sure you want to delete ${geo.city}?`,
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
                            else {
                                DeleteGeoLocationDB(id)
                            }
                        //
                        setMarks(newMarks)
                    }
                }
            ],
            { cancelable: false }
        )

    }

    async function addMarker() {
        if (newCoord.id && newCoord.id > 0) {
            showToast('Erro ao salvar. Location already saved!')
            return
        }

        const savedCoords = await AddCoordsDB({ latitude: newCoord.latitude, longitude: newCoord.longitude })
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

        setNewCoord({} as Coordinate)

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
                        // setTimeout(() => setLoading(true), 1000)
                        setTimeout(() => Updates.reloadAsync(), 1000)
                    }
                }
            ],
            { cancelable: false }
        )

    }

    function handleLocationSelected(geo: GeoLocation) {
        setRegion({
            latitude: geo.coords?.latitude,
            longitude: geo.coords?.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta
        })
        //
        Alert.alert(
            'Reload App',
            'Would you like to reload the app with the new location selected?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No')
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        await SetInfo({
                            key: 'CurrentCoord',
                            value: JSON.stringify(geo.coords)
                        })
                        //
                        showToast('App is reloading...', 'center', 'long')
                        //setTimeout(() => setLoading(true), 1000)
                        setTimeout(() => Updates.reloadAsync(), 1000)

                    }
                }
            ],
            { cancelable: false }
        )
    }

    if (!region || !region.latitude)
        return <Loader message={'Loading map...'} />

    return (
        <View style={Styles.container} >
            <View style={Styles.mapContainer} >
                <MapView style={Styles.map}
                    initialRegion={{
                        latitude: locationData.coords.latitude,
                        longitude: locationData.coords.longitude,
                        latitudeDelta: 0.014,
                        longitudeDelta: 0.014
                    }}
                    onRegionChangeComplete={setRegion}
                    region={region}
                    onLongPress={element => {
                        const latitude = element.nativeEvent.coordinate.latitude
                        const longitude = element.nativeEvent.coordinate.longitude
                        //
                        setNewCoord({ latitude, longitude })
                        setRegion({
                            latitude,
                            longitude,
                            latitudeDelta: region.latitudeDelta,
                            longitudeDelta: region.longitudeDelta
                        })
                    }}

                >

                    {newCoord && newCoord.latitude && (
                        <Marker
                            coordinate={newCoord}
                            pinColor={colorCurrent}
                        />
                    )}
                    {
                        marks.map(marker => {
                            return (
                                <Marker
                                    key={marker.id}
                                    // @ts-ignore
                                    coordinate={{ latitude: marker.coords.latitude, longitude: marker.coords.longitude }}
                                    pinColor={colors[((marker.id ? marker.id : 0) - 1) % colors.length]}
                                    style={Styles.mapMarker}
                                >
                                    <View style={{...Styles.mapMarkerContainer, backgroundColor: colors[((marker.id ? marker.id : 0) - 1) % colors.length]}} >
                                    <Image
                                            source={
                                                marker.image_uri && marker.image_uri !== '' ?
                                                {uri: marker.image_uri}
                                                :
                                                require('../../../assets/location.jpg')
                                            }

                                            style={Styles.mapMarkerImage}
                                        />
                                        <Text style={Styles.mapMarkerTitle} >{marker.city}</Text>
                                    </View>
                                </Marker>
                            )
                        }
                        )
                    }

                </MapView>
            </View>

            <View style={Styles.itemsContainer} >
                <Text style={Styles.itemTitle} >My Locations <Text style={Styles.itemTitleObs} >(press to focus; long press to delete)</Text></Text>
                <ScrollView
                    horizontal
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {newCoord && newCoord.latitude && (
                        <View style={Styles.item}  >
                            <TouchableOpacity onPress={() => addMarker()} style={Styles.addButton} >
                                <Icon name='add-to-list' size={64} color={'#505050'} />
                                <Text style={Styles.addText} >Add Current Location</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {
                        marks.map(mark => {
                            return (
                                <TouchableOpacity
                                    key={mark.id}
                                    style={{ ...Styles.item, backgroundColor: colors[((mark.id ? mark.id : 0) - 1) % colors.length] }}
                                    delayLongPress={750}
                                    onPress={() => handleLocationSelected(mark)}
                                    onLongPress={() => removeMarker(mark)}
                                >
                                    <Text style={Styles.itemText} >{mark.city}</Text>
                                    <Text style={Styles.itemFlag} >{mark.flag}</Text>
                                    <Text style={Styles.descriptionText} >{mark.coords?.latitude.toFixed(2) + ', ' + mark.coords?.longitude.toFixed(2)}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }



                </ScrollView>
            </View>


        </View >
    )
}

export default Location
