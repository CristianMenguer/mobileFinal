import React, { useState, useEffect } from 'react'
import { Text, View, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import Styles from './style'

const Home: React.FC = () => {

    const isFocused = useIsFocused()

    const { locationData } = useLocation()
    const { weatherData } = useWeather()

    const [location, setLocation] = useState('')
    const [temperature, setTemperature] = useState('')
    const [logoWeather, setLogoWeather] = useState('https://icons.iconarchive.com/icons/dakirby309/windows-8-metro/128/Web-The-Weather-Channel-Metro-icon.png')

    useEffect(() => {
        if (!isFocused)
            return
        //
        if (locationData?.country)
            setLocation(`${locationData.city ? locationData.city : locationData.county}, ${locationData.country}`)
        //
        if (weatherData?.description) {
            setTemperature(`${weatherData.description} - ${weatherData.temperature}`)
            setLogoWeather(weatherData.iconUri)
        }
        //
    }, [isFocused, locationData, weatherData])

    if (location === '' || temperature === '')
        return <Loader message='Loading Location and Temperature' />
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
                and further researches about Mobile Development.</Text>
                    <Text style={Styles.text} >Lecture: Mobile Development</Text>
                    <Text style={Styles.text} >Lecturer: Amilcar Aponte</Text>
                    <Text style={Styles.text} >{location}</Text>
                    <Text style={Styles.text} >{weatherData.description}</Text>
                    <Text style={Styles.text} >{weatherData.temperature}℃</Text>

                    <Image source={{ uri: logoWeather }} style={Styles.logoWeather} />

                </View>
            </View>
        </>
    )
}

export default Home
