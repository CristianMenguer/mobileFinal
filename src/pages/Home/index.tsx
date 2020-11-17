import React, { useState, useEffect } from 'react'
import { Text, View, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import Styles from './style'

/**
 * This is the Home Page.
 * This page shows information about the project and
 * the current city, country and weather.
 */

const Home: React.FC = () => {

    // Hook to get the current focus state of the screen. Returns a true if screen is focused.
    const isFocused = useIsFocused()

    // Get locationData and weatherData from the hooks
    const { locationData } = useLocation()
    const { weatherData } = useWeather()

    const [location, setLocation] = useState('')
    const [temperature, setTemperature] = useState('')
    const [logoWeather, setLogoWeather] = useState('https://icons.iconarchive.com/icons/dakirby309/windows-8-metro/128/Web-The-Weather-Channel-Metro-icon.png')

    // This method sets the variables that are shown on screen.
    useEffect(() => {
        if (!isFocused)
            return
        //s
        if (locationData?.country)
            setLocation(`${locationData.city ? locationData.city : locationData.county}, ${locationData.country} ${locationData.flag}`)
        else if (locationData?.formatted)
            setLocation(locationData.formatted)
        else
        setLocation('Location not found!')
        //
        if (weatherData?.description) {
            setTemperature(`${weatherData.description} - ${weatherData.temperature}`)
            setLogoWeather(weatherData.iconUri)
        }
        //
    }, [isFocused, locationData, weatherData])

    /**
     * It is probably never used. It is just to make sure that everything
     * was right in the Loading Page, as this is the first page shown
     * after the Loading process.
    */
    if (location === '' || temperature === '')
        return <Loader message='No Location and Temperature Data' />
    //
    return (
        <>
            <View style={Styles.fullContainer} >
                <View style={Styles.container} >
                    <Image
                        source={require('../../../assets/logo.jpg')}
                        style={Styles.logo}
                    />
                    <View >
                        <Text style={Styles.text} >This React Native prototype was developed by </Text>
                        <Text style={Styles.textName} >Cristian Menguer</Text>
                        <Text style={Styles.text} > using TypeScript.</Text>
                    </View >

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
