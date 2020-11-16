import React, { useState, useEffect } from 'react'
import { Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import * as Updates from 'expo-updates'

import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import Styles from './style'
import { DeleteInfo } from '../../services/InfoStorage'
import useAllData from '../../hooks/allData'
import { dropTablesDb } from '../../database'

const Home: React.FC = () => {

    const isFocused = useIsFocused()

    const { locationData } = useLocation()
    const { weatherData } = useWeather()
    const { setLoading } = useAllData()

    const [location, setLocation] = useState('')
    const [temperature, setTemperature] = useState('')
    const [logoWeather, setLogoWeather] = useState('https://icons.iconarchive.com/icons/dakirby309/windows-8-metro/128/Web-The-Weather-Channel-Metro-icon.png')

    async function resetData() {
        await dropTablesDb()
        await DeleteInfo('CurrentCoord')
        Updates.reloadAsync()
    }

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
            {/* <TouchableOpacity onPress={() => resetData()} style={{
                width: 210,
                height: 60,
                backgroundColor: '#04D361',
                borderRadius: 5,
                borderWidth: 0,
                justifyContent: 'center',
                alignItems: 'center',
            }} >
                <Text >Reset Data</Text>
            </TouchableOpacity> */}
        </>
    )
}

export default Home
