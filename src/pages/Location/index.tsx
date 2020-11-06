import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Toast from 'react-native-tiny-toast'
import { Entypo as Icon } from '@expo/vector-icons'

import Loader from '../../components/Loader'
import useLocation from '../../hooks/location'

import Styles from './style'
import { Alert } from 'react-native'

const Location: React.FC = () => {

    //import path from 'path'
    //const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')

    const { locationData } = useLocation()

    const [coord, setCoord] = useState({} as Coordinate)
    const [marks, setMarks] = useState<Address[]>([])

    const colors = [
        'red',
        'tomato',
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

    useEffect(() => {
        setCoord(locationData.coords)
    }, [])

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

    function addMarker() {
        const size = marks.length
        let newCoord: Address = {
            id: size + 1,
            coords: {
                latitude: locationData.coords.latitude + (size * 0.0005),
                longitude: (locationData.coords.longitude) + (size * 0.0005)
            }
        }
        let newMarks = []
        for (const item of marks)
            newMarks.push(item)
        //
        newMarks.push(newCoord)
        setMarks(newMarks)
        Toast.show('Current Location saved!', {
            duration: Toast.duration.SHORT,
            animationDuration: 500,
            containerStyle: {
                width: '75%',
                borderRadius: 100,
                backgroundColor: '#555'
            }
        })
    }

    if (!coord || !coord.latitude)
        return <Loader message={'Loading map...'} />

    return (
        <View style={Styles.container} >
            <View style={Styles.mapContainer} >
                <MapView style={Styles.map}
                    initialRegion={{
                        latitude: coord.latitude,
                        longitude: coord.longitude,
                        latitudeDelta: 0.014,
                        longitudeDelta: 0.014
                    }}
                    loadingEnabled={!coord.latitude}
                >
                    {
                        marks.map(marker => {
                            return (
                                <Marker
                                    key={marker.id}
                                    coordinate={{ ...marker.coords }}
                                    pinColor={colors[(marker.id - 1) % 18]}

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
                                    style={Styles.item}
                                    delayLongPress={750}
                                    onLongPress={() => removeMarker(mark.id)}
                                >
                                    <Text style={Styles.itemText} >Dublin</Text>
                                    <Text style={Styles.descriptionText} >Lat: 54.43</Text>
                                    <Text style={Styles.descriptionText} >Lng: -6.96</Text>
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
