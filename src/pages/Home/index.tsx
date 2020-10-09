import React, { useState, useEffect, useContext } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Toast from 'react-native-tiny-toast'

import { getLocationPermission } from './../../services/Permissions'
import useLocation from '../../hooks/location'
import Loader from '../../components/Loader'
import Styles from './style'
import { GetInfo } from '../../services/InfoStorage'

const Home: React.FC = () => {

    const { data, getCoordsDevice, setCoords, GetDataApi, GetData } = useLocation()

    // Video Fase 04 - 02 - 02 - 03 - 10min35

    const [hasPermission, setHasPermission] = useState(false)
    const [location, setLocation] = useState('')
    const [temperature, setTemperature] = useState(-500)

    useEffect(() => {
        async function LoadStorage() {
            const response = await GetInfo('CurrentLocation')
            if (!!response)
                setCoords(JSON.parse(response))
        }
        //
        LoadStorage()
        //
        getLocationPermission()
            .then(response => {
                setHasPermission(response)
            })
        //
    }, [])

    useEffect(() => {
        if (!hasPermission)
            return
        //
        async function loadCoords() {
            const response = await getCoordsDevice()
            await setCoords(response)
            await GetDataApi()
            setLocation(`${GetData().city}, ${GetData().country}`)
            setTemperature(23)
        }

        loadCoords()

    }, [hasPermission])

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
