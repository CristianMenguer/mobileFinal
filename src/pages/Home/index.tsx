import React, { useState, useEffect, useContext } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Toast from 'react-native-tiny-toast'

import { getLocationPermission } from './../../services/Permissions'
import { LocationContext } from '../../hooks/location'
import Loader from '../../components/Loader'
import Styles from './style'

const Home = () => {

    Toast.show('hi')

    console.log('a')
    const { data, getCoordsDevice, setCoords } = useContext(LocationContext)
    console.log('b')

    // Video Fase 04 - 02 - 02 - 03 - 9min45

    const [hasPermission, setHasPermission] = useState(false)
    const [location, setLocation] = useState('')
    const [temperature, setTemperature] = useState(-500)

    useEffect(() => {
        console.log('1')
        getLocationPermission()
        .then(response => {
            console.log('2')
            setHasPermission(response)
        })
    }, [])

    useEffect(() => {
        console.log('3')
        if (!hasPermission)
            return
        //
        console.log('4')
        getCoordsDevice()
        .then(response => {
            console.log('5')
            setCoords(response)
        })

    }, [hasPermission])

    useEffect(() => {
        console.log('useEffect data')
        if (data)
            setCoords(data)
        //
    }, [data])

    if (location === '' || temperature <= -500)
        return <Loader />
    //
    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/logo.jpg')}
                    style={Styles.logo}
                />
                <Text>This prototype was developed by Cristian Menguer using React Native.</Text>
                <Text>The purpose of this project is apply all the acquired knowledge in class
                and further researches about the Mobile Development.</Text>
                <Text>Lecture: Mobile Development</Text>
                <Text>Lecturer: Amilcar Aponte</Text>
                <Text>{location} - {temperature}℃</Text>

            </View>
        </>
    )
}

export default Home


/*

const showToast = () => {
        Toast.show('Image touched!', {
            position: Toast.position.BOTTOM,
            duration: Toast.duration.SHORT,
            containerStyle: {
                borderRadius: 10,
                width: '90%'
            },
            textStyle: {
                color: '#e91e63'
            },
            animationDuration: 500
        })
        setLocation('')
        setTemperature(-520)
        setInterval(() => {
            setLocation('Dublin')
            setTemperature(20)
        }, 2500)
    }

    setInterval(() => {
        setLocation('Dublin')
        setTemperature(20)
    }, 2500)

        // useEffect(() => {
    //     getLocationPermission().then(data => {
    //         setHasPermission(data)
    //     })
    // }, [])

    // useEffect(() => {
    //     if (hasPermission) {
    //         ExpoLocation.getCurrentPositionAsync({
    //             accuracy: ExpoLocation.Accuracy.Highest
    //         })
    //             .then(data => {
    //                 setCoords(data.coords)
    //                 //setCoords({ latitude: -29.737645, longitude: -51.137464 })
    //             })
    //     }
    // }, [hasPermission])

*/
