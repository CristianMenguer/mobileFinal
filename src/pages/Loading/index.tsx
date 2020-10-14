import React, { useState, useEffect, useContext } from 'react'
import { Text, View, Image } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import * as ExpoLocation from 'expo-location'

import { getLocationPermission, getStoragePermission } from './../../services/Permissions'
import useAllData from '../../hooks/allData'
import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import Styles from './style'
import { GetInfo, SetInfo } from '../../services/InfoStorage'
import { GetWeather } from '../../services/WeatherApi'

const Loading: React.FC = () => {

    const isFocused = useIsFocused()

    const { isLoading, setLoading } = useAllData()
    const { setCoords, setGeoData, getGeoDataApi } = useLocation()
    const { setWeatherCoords, setWeatherData, getWeatherData, getWeatherDataApi } = useWeather()

    const [hasPermission, setHasPermission] = useState(false)

    async function loadAllData() {
        let coords: Coordinate = {} as Coordinate
        let geoLocation: GeoLocation
        let weather: Weather = {} as Weather
        let dailyWeather: Forecast[]
        let hourlyWeather: Forecast[]

        const locationStorage = await GetInfo('CurrentLocation')
        //
        if (!!locationStorage) {
            const { latitude, longitude } = JSON.parse(locationStorage)
            coords = {
                latitude,
                longitude
            }
            setCoords(coords)
            //
        } else {
            const locationDevice = await ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Highest
            })
            //
            if (!!locationDevice) {
                const { latitude, longitude } = locationDevice.coords
                coords = {
                    latitude,
                    longitude
                }
                setCoords(coords)
            }
        }
        //
        //if (coords !== {} as Coordinate)
        {
            const geoLocationString = await GetInfo('GeoLocation')
            if (!!geoLocationString) {
                geoLocation = JSON.parse(geoLocationString)
                setGeoData(geoLocation)
                //
            } else {
                geoLocation = await getGeoDataApi()
                await SetInfo({
                    key: 'GeoLocation',
                    value: JSON.stringify(geoLocation)
                })
                //
            }
        }
        //
        setWeatherCoords(coords)
        const weatherString = await GetInfo('Weather')
        if (!!weatherString) {
            weather = JSON.parse(weatherString)
            setWeatherData(weather)
            //
        }
        //
        if (!weatherString || ((new Date().getTime() - weather.timeAPI) > (60000 * 0.01))) {
            weather = await getWeatherDataApi()
            await SetInfo({
                key: 'Weather',
                value: JSON.stringify(weather)
            })
            //
        }
        //
        // const dailyString = await GetInfo('DailyWeather')
        // if (!!dailyString) {
        //     dailyWeather = JSON.parse(dailyString)
        //     setWeatherData(dailyWeather)
        //     //
        // }
        // //
        // else {
        //     dailyWeather = await getWeatherDataApi()
        //     await SetInfo({
        //         key: 'DailyWeather',
        //         value: JSON.stringify(dailyWeather)
        //     })
        //     //
        // }
        //

        //
        setLoading(false)

    }

    useEffect(() => {
        if (!isFocused)
            return
        //
        loadAllData()
        //

    }, [isFocused])

    return <Loader />
}

export default Loading
