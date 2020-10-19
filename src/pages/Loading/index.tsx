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

const Loading: React.FC = () => {


    const isFocused = useIsFocused()
    const [message, setMessage] = useState('')
    const [coord, setCoord] = useState({} as Coordinate)

    const { setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather } = useAllData()

    const { setCoords, locationData, setGeoData } = useLocation()
    const { setWeatherCoords, setWeatherData, getWeatherDataApi, weatherData, setDaily, setHourly } = useWeather()

    const [hasPermission, setHasPermission] = useState(false)

    useEffect(() => {
        if (!isFocused || hasPermission)
            return
        //
        setMessage('Permission is necessary to continue!')
        //
        getLocationPermission().then(data => {
            setHasPermission(data)
        })
    }, [isFocused])

    useEffect(() => {
        if (!isFocused || !hasPermission)
            return
        //
        setMessage('Loading last/current location!')
        //
        loadCoord()
            .then(data => {
                if (!!data.latitude)
                    setCoord(data)
            })
    }, [isFocused, hasPermission])

    useEffect(() => {
        if (!isFocused || !coord.latitude)
            return
        //
        setMessage('Location read!')
        //
        setCoords(coord)
    }, [isFocused, coord])

    useEffect(() => {
        if (!isFocused || !locationData.coords?.latitude)
            return
        //
        setMessage('Coordinates set')
        loadGeoLocation()
            .then(data => {
                if (!!data.country)
                    setGeoData(data)
            })
    }, [isFocused, locationData.coords])

    useEffect(() => {
        if (!isFocused || !locationData.country)
            return
        //
        setMessage('Geo Location set')
        setWeatherCoords(coord)
        //
    }, [isFocused, locationData.country])

    useEffect(() => {
        if (!isFocused || !weatherData.coords?.latitude)
            return
        //
        setMessage('Loading Current Weather')
        loadWeather()
            .then(data => {
                if (!!data.description)
                    setWeatherData({ ...data })
            })
        //
    }, [isFocused, weatherData.coords])

    useEffect(() => {
        if (!isFocused || !weatherData.description)
            return
        //
        setMessage('Loading Daily Weather!')
        //
        loadDailyWeather()
            .then(data => {
                if (data[0]?.description) {
                    setDaily(data)
                    setMessage('Loading Hourly Weather!')
                    loadHourlyWeather()
                        .then(data => {
                            if (data[0]?.description) {
                                setHourly(data)
                                setLoading(false)
                            }
                        })
                }
            })

    }, [isFocused, weatherData.description])

    return <Loader message={message} />
}

export default Loading
