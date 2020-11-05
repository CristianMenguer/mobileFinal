import React, { useEffect, useState } from 'react'
import { Text, View, Image, Platform, SafeAreaView, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import Toast from 'react-native-tiny-toast'

import Loader from '../../components/Loader'
import useLocation from '../../hooks/location'

import Styles from './style'

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

    function addMarker() {
        // console.log('addMarker')
        // console.log(marks)
        const size = marks.length
        // console.log(size)
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
                                    coordinate={{...marker.coords}}
                                    pinColor={colors[(marker.id - 1) % 18]}

                                />
                            )
                        }
                        )
                    }

                </MapView>
            </View>

            <View style={Styles.itemsContainer} >
                <TouchableOpacity onPress={() => addMarker()} style={Styles.button} >
                    <Text>Add Current Location</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default Location
