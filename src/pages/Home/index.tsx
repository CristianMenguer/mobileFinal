import React, { useState, useEffect, useContext } from 'react'
import { Text, View, Image } from 'react-native'

import { getLocationPermission, getStoragePermission } from './../../services/Permissions'
import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import Styles from './style'
import { GetInfo } from '../../services/InfoStorage'
import { GetWeather } from '../../services/WeatherApi'

interface Coordinates {
    latitude: number
    longitude: number
}

interface GeoLocationData {
    coords: Coordinates
    city: string
    county: string
    country: string
    formatted: string
}

interface WeatherData {
    temperature: number
    description: string
    iconCode: string
    iconUri: string
}

const Home: React.FC = () => {

    const { getCoordsDevice, setGeoCoords, GetGeoData } = useLocation()
    const { setWeatherCoords, GetWeatherData } = useWeather()

    // Video Fase 04 - 02 - 02 - 03 - 10min35

    const [hasPermission, setHasPermission] = useState(false)
    const [location, setLocation] = useState('')
    const [temperature, setTemperature] = useState('')
    const [geoData, setGeoData] = useState({} as GeoLocationData)
    const [weatherData, setWeatherData] = useState({} as WeatherData)
    const [logoWeather, setLogoWeather] = useState('https://icons.iconarchive.com/icons/dakirby309/windows-8-metro/128/Web-The-Weather-Channel-Metro-icon.png')

    useEffect(() => {
        async function LoadStorage() {
            await getStoragePermission()
            const response = await GetInfo('CurrentLocation')
            if (!!response) {
                setGeoCoords(JSON.parse(response))
                setWeatherCoords(JSON.parse(response))
            }
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
            // const response = {
            //     latitude: -29.74,
            //     longitude: -51.15
            // }
            await setGeoCoords(response)
            await setWeatherCoords(response)
            const newGeoData = geoData
            newGeoData.city = GetGeoData().city
            newGeoData.country = GetGeoData().country
            newGeoData.county = GetGeoData().county
            newGeoData.coords = GetGeoData().coords
            newGeoData.formatted = GetGeoData().formatted
            setGeoData(newGeoData)
            setLocation(`${geoData.city ? geoData.city : geoData.county}, ${geoData.country}`)
            //
            const newWeatherData = weatherData
            newWeatherData.temperature = GetWeatherData().temperature
            newWeatherData.description = GetWeatherData().description
            newWeatherData.iconCode = GetWeatherData().iconCode
            newWeatherData.iconUri = GetWeatherData().iconUri
            setWeatherData(newWeatherData)
            setTemperature(`${weatherData.description} - ${weatherData.temperature}`)
            //
            setLogoWeather(weatherData.iconUri)
        }

        loadCoords()

    }, [hasPermission])

    if (location === '' || temperature === '')
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
                    <Text style={Styles.text} >{location}</Text>
                    <Text style={Styles.text} >{temperature}℃</Text>

                    <Image source={{uri: logoWeather}} style={Styles.logoWeather} />

                </View>
            </View>
        </>
    )
}

export default Home
