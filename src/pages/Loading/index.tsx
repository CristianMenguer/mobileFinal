import React, { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { getLocationPermission } from './../../services/Permissions'
import useAllData from '../../hooks/allData'
import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import useCurrency from '../../hooks/currency'

const Loading: React.FC = () => {


    const isFocused = useIsFocused()
    const [message, setMessagee] = useState('')
    const [coord, setCoord] = useState({} as Coordinate)

    const { setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather, loadCurrencyData } = useAllData()

    const { setCoords, locationData, setGeoData } = useLocation()
    const { setWeatherCoords, setWeatherData, weatherData, setDaily, setHourly } = useWeather()
    const { SetCurrencyBase, SetCurrencyData, currencyBase, currencyData } = useCurrency()

    const [hasPermission, setHasPermission] = useState(false)

    function setMessage(newMessage: string) {
        // console.log(`> Loading Page => Setting new Message: ${newMessage}`)
        setMessagee(newMessage.replace('. ', '.\n'))
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

    async function loadData() {
        setMessage('Loading last/current location!')
        //
        const coordResp = await loadCoord()

        if (!coordResp.id || coordResp.id < 1)
            console.log('save id here')

        setCoord(coordResp)

        setMessage('Location read. Setting App coordinates!')

        setCoords(coord)

        setMessage('App Coordinates set. Loading Geo Location info!')

        const geoResp = await loadGeoLocation()

        setGeoData(geoResp)

        setMessage('Geo Location set. Reading currency from location!')

        SetCurrencyBase(geoResp.currency_code)

        setMessage('Currency Base set. Loading currency rates!')

        const currResp = await loadCurrencyData(currencyBase)

        SetCurrencyData(currResp)

        setMessage('Currency Rates set. Starting loading weather info!')

        setWeatherCoords(coord)

        const weatherResp = await loadWeather()

        setWeatherData(weatherResp)

        setMessage('Loading Daily Weather!')

        const dailyResp = await loadDailyWeather()

        setDaily(dailyResp)

        setMessage('Loading Hourly Weather!')

        const hourlyResp = await loadHourlyWeather()

        setHourly(hourlyResp)

        setLoading(false)

    }

    useEffect(() => {
        if (!isFocused || !hasPermission)
            return
        //
        loadData()

    }, [isFocused, hasPermission])

    return <Loader message={message} />
}

export default Loading
