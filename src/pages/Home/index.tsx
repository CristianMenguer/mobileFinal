import React, { useState, useEffect, useContext } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import Toast from 'react-native-tiny-toast'

import { getLocationPermission } from './../../services/Permissions'
import useLocation from '../../hooks/location'
import Loader from '../../components/Loader'
import Styles from './style'
import { GetInfo } from '../../services/InfoStorage'

interface GeoLocation {
    city: string
    county: string
    country: string
    formatted: string
}

const Home: React.FC = () => {

    const { getCoordsDevice, setCoords, GetDataApi, GetData } = useLocation()

    // Video Fase 04 - 02 - 02 - 03 - 10min35

    const [hasPermission, setHasPermission] = useState(false)
    const [location, setLocation] = useState('')
    const [temperature, setTemperature] = useState(-500)
    const [geoData, setGeoData] = useState({} as GeoLocation)

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
            setGeoData(GetData())
            setLocation(`${geoData.city ? geoData.city : geoData.county}, ${geoData.country}`)
            setTemperature(23)
        }

        loadCoords()

    }, [hasPermission])

    if (location === '' || temperature <= -500)
        return <Loader />
    //
    return (
        <>
            <View style={Styles.fullContainer} >
                <View style={Styles.container} >
                    <Image
                        source={require('../../../assets/logo.jpg')}
                        style={Styles.logo}
                    />
                    <Text style={Styles.text} >This React Native prototype was developed by Cristian Menguer using TypeScript.</Text>
                    <Text style={Styles.text} >The purpose of this project is apply all the acquired knowledge in class
                and further researches about the Mobile Development.</Text>
                    <Text style={Styles.text} >Lecture: Mobile Development</Text>
                    <Text style={Styles.text} >Lecturer: Amilcar Aponte</Text>
                    <Text style={Styles.text} >{location} - {temperature}℃</Text>

                </View>
            </View>
        </>
    )
}

export default Home
