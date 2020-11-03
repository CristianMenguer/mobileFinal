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
import useCurrency from '../../hooks/currency'

const Loading: React.FC = () => {


    const isFocused = useIsFocused()
    const [message, setMessagee] = useState('')
    const [coord, setCoord] = useState({} as Coordinate)

    const { setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather, loadCurrencyData } = useAllData()

    const { setCoords, locationData, setGeoData } = useLocation()
    const { setWeatherCoords, setWeatherData, getWeatherDataApi, weatherData, setDaily, setHourly } = useWeather()
    const { SetCurrencyBase, SetCurrencyData, currencyBase, currencyData } = useCurrency()

    const [hasPermission, setHasPermission] = useState(false)

    function setMessage(newMessage: string) {
        // console.log(`> Loading Page => Setting new Message: ${newMessage}`)
        setMessagee(newMessage)
    }

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
        setMessage('Location read. Setting App coordinates!')
        //
        setCoords(coord)
    }, [isFocused, coord])

    useEffect(() => {
        if (!isFocused || !locationData.coords?.latitude)
            return
        //
        setMessage('App Coordinates set. Loading Geo Location info!')
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
        setMessage('Geo Location set. Reading currency from location!')
        SetCurrencyBase(locationData.currency_code)
        //
    }, [isFocused, locationData.country])

    useEffect(() => {
        if (!isFocused || !currencyBase)
            return
        //
        setMessage('Currency Base set. Loading currency rates!')
        loadCurrencyData(currencyBase)
            .then(data => {
                SetCurrencyData({...data})
            })
        //
    }, [isFocused, currencyBase])

    useEffect(() => {
        if (!isFocused || !currencyData['USD'] || currencyData['USD'] == 0)
            return
        //
        setMessage('Currency Rates set. Starting loading weather info!')
        setWeatherCoords(coord)

    }, [isFocused, currencyData['USD']])

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
