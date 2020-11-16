import React, { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'
import * as Network from 'expo-network'

import { getLocationPermission, getCameraPermission } from './../../services/Permissions'
import useAllData from '../../hooks/allData'
import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import useCurrency from '../../hooks/currency'
import { AddCoordsDB } from '../../models/Location'
import { DeleteInfo, SetInfo } from '../../services/InfoStorage'
import { dropTablesDb } from '../../database'

const Loading: React.FC = () => {

    const isFocused = useIsFocused()
    const [message, setMessagee] = useState('')

    const { setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather, loadCurrencyData } = useAllData()

    const { setCoords, setGeoData } = useLocation()
    const { setWeatherCoords, setWeatherData, setDaily, setHourly } = useWeather()
    const { SetCurrencyData } = useCurrency()

    const [hasLocationPermission, setLocationPermission] = useState(false)
    const [hasCameraPermission, setCameraPermission] = useState(false)
    const [hasNetwork, setHasNetwork] = useState(false)

    function setMessage(newMessage: string) {
        // console.log(`> Loading Page => Setting new Message: ${newMessage}`)
        setMessagee(newMessage.replace('. ', '.\n'))
    }

    useEffect(() => {
        if (!isFocused)
            return
        //
        if (!hasNetwork) {
            setMessage('Waiting for network')
            Network.getNetworkStateAsync()
                .then(networkResponse => {
                    if (networkResponse.isInternetReachable)
                        setHasNetwork(networkResponse.isInternetReachable)
                })
        }
        //
        if (!hasLocationPermission) {
            setMessage('Waiting for Location Permission')
            getLocationPermission().then(setLocationPermission)
        }
        //
        if (!hasCameraPermission) {
            setMessage('Waiting for Camera Permission')
            getCameraPermission().then(setCameraPermission)
        }
    }, [isFocused])

    async function loadData() {

        // await dropTablesDb()
        // await DeleteInfo('CurrentCoord')

        setMessage('Loading last/current location')
        //
        let coords = await loadCoord()

        if (!coords.id || coords.id < 1)
            coords = await AddCoordsDB(coords)
        //
        if (!coords.id)
            return
        //
        await SetInfo({
            key: 'CurrentCoord',
            value: JSON.stringify(coords)
        })

        setMessage('Location read. Setting App coordinates')

        setCoords(coords)

        setMessage('App Coordinates set. Loading Geo Location info')

        const geoResp = await loadGeoLocation(coords)

        geoResp.coords = coords
        geoResp.coordId = coords.id

        setGeoData(geoResp)

        setMessage('Geo Location set. Reading currency from location')

        setMessage('Currency Base set. Loading currency rates')

        const currResp = await loadCurrencyData(geoResp.currency_code)

        SetCurrencyData(currResp)

        setMessage('Currency Rates set. Starting loading weather info')

        setWeatherCoords(coords)

        const weatherResp = await loadWeather(coords)

        setWeatherData(weatherResp)

        setMessage('Loading Daily Weather')

        const dailyResp = await loadDailyWeather(weatherResp.id, coords)

        setDaily(dailyResp)

        setMessage('Loading Hourly Weather')

        const hourlyResp = await loadHourlyWeather(weatherResp.id, coords)

        setHourly(hourlyResp)

        setLoading(false)

    }

    useEffect(() => {
        if (!isFocused || !hasNetwork || !hasCameraPermission || !hasLocationPermission)
            return
        //
        loadData()

    }, [isFocused, hasCameraPermission, hasLocationPermission, hasNetwork])

    return <Loader message={message} />
}

export default Loading
