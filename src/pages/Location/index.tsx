import React, { useEffect, useState } from 'react'
import { Text, View, Image, Platform, SafeAreaView } from 'react-native'
import * as ExpoLocation from 'expo-location'
import * as SecureStore from 'expo-secure-store'
import MapView, { Marker } from 'react-native-maps'

import { getLocationPermission } from './../../services/Permissions'
import { GetGeo } from '../../services/GeoApi'
import { GetWeather, GetWeatherIcon } from '../../services/WeatherApi'

import Loader from '../../components/Loader'

import Styles from './style'

interface Coordinates {
    latitude: number
    longitude: number
}

interface GeoLocation {
    road: string
    city_district: string
    place: string
    city: string
    country: string
    formatted: string
}

interface Currency {
    decimal_mark: string
    iso_code: string
    name: string
    subunit: string
    symbol: string
    symbol_first: string
    thousands_separator: string
}

interface Weather {
    sunrise: string         // Sunrise time (HH:MM)
    sunset: string          // Sunset time (HH:MM)
    pres: string            // Pressure (mb)
    wind_spd: number        // Wind speed (Default m/s)
    wind_dir: number        // Wind direction (degrees)
    temp: number            // Temperature (default Celcius)
    app_temp: number        // Apparent/"Feels Like" temperature (default Celcius)
    rh: number              // Relative humidity (%)
    clouds: number          // Cloud coverage (%)
    pod: string             // Part of the day (d = day / n = night)
    weather: {
        icon: string        // Weather icon code
        description: string // Text weather description
        code: number        // Weather code
    }
    vis: number             // Visibility
    precip: number          // Liquid equivalent precipitation rate (default mm/hr)
    snow: number            // Snowfall (default mm/hr)
    uv: number              // UV Index (0-11+)
    aqi: number             // Air Quality Index [US - EPA standard 0 - +500]
}

const Location = () => {

    //import path from 'path'
    //const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')

    const _storeData = async () => {
        try {
            await SecureStore.setItemAsync('-mobileFinal-test', 'I like to save it.')
        } catch (error) {
            console.log(error)
        }
    }

    const _retrieveData = async () => {
        try {
            const value = await SecureStore.getItemAsync('-mobileFinal-test')
            if (value !== null) {
                // We have data!!
                console.log(value)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const _deleteData = async () => {
        try {
            const value = await SecureStore.deleteItemAsync('-mobileFinal-test')
            if (value !== null) {
                // We have data!!
                console.log(value)
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (Platform.OS !== 'web') {
        _storeData()
        _retrieveData()
        _deleteData()
    } else {
        localStorage.setItem('@mobileFinal:test', 'I like to save it in web.')
        console.log(localStorage.getItem('@mobileFinal:test'))
        localStorage.removeItem('@mobileFinal:test')
    }


    const [hasPermission, setHasPermission] = useState(false)
    const [coords, setCoords] = useState<Coordinates>()
    const [geoLocation, setGeoLocation] = useState<GeoLocation>()
    const [flag, setFlag] = useState()
    const [currency, setCurrency] = useState<Currency>()
    const [weather, setWeather] = useState<Weather>()
    const [logoWeather, setLogoWeather] = useState('https://icons.iconarchive.com/icons/dakirby309/windows-8-metro/128/Web-The-Weather-Channel-Metro-icon.png')

    useEffect(() => {
        getLocationPermission().then(data => {
            setHasPermission(data)
        })
    }, [])

    useEffect(() => {
        if (hasPermission) {
            ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Highest
            })
                .then(data => {
                    setCoords(data.coords)
                    //setCoords({ latitude: -29.737645, longitude: -51.137464 })
                })
        }
    }, [hasPermission])

    useEffect(() => {
        if (coords) {
            GetGeo(coords)
                // GetGeo({latitude: -29.737645, longitude: -51.137464})
                .then(data => {
                    setGeoLocation(data.components)
                    setGeoLocation({ ...data.components, formatted: data.formatted })
                    setFlag(data.annotations.flag)
                    setCurrency(data.annotations.currency)

                    //console.log(data)
                })
            //
            GetWeather(coords)
                .then(data => {
                    setWeather(data)
                })
        }

    }, [coords])

    useEffect(() => {
        if (!!weather)
            setLogoWeather(GetWeatherIcon(weather.weather.icon))
        //
        console.log(logoWeather)
    }, [weather])

    function getWeatherIcon() {
        return logoWeather
    }

    if (!!!geoLocation || !!!coords || !!!logoWeather)
        return <Loader />

    return (
        <View style={Styles.container} >
            <View style={Styles.weatherContainer} >
                <Text style={{ maxWidth: '80%', textAlign: 'center' }} >{`${geoLocation.formatted} ${flag}`}</Text>
                <Text>{`${currency?.name} (${currency?.symbol})`}</Text>
                {/* {!!weather && <Image source={require(GetWeatherIcon(weather.weather.icon))} />} */}
                {!!weather && <Text>{weather.temp} ºC - {weather.weather.description}</Text>}
                {/* {!!weather && <Image source={logoWeather} style={{ width: 80, height: 80, borderRadius: 25 }} />} */}
            </View>

            <View style={Styles.mapContainer} >
                {Platform.OS === 'web' ?

                    <Text >Run the app in your device in order to see the map</Text>
                    :
                    <Text >Map</Text>

                }
            </View>
        </View>
    )
}

export default Location
