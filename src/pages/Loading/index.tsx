import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { useIsFocused } from '@react-navigation/native'
import * as Network from 'expo-network'

import { getLocationPermission, getCameraPermission } from './../../services/Permissions'
import useAllData from '../../hooks/allData'
import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'
import Loader from '../../components/Loader'
import useCurrency from '../../hooks/currency'
import { AddCoordsDB } from '../../models/Location'
import { GetInfo, SetInfo } from '../../services/InfoStorage'

/**
 * This is the loading page.
 * It is called when the app starts to load all the information
 * necessary to use the app.
 */

const Loading: React.FC = () => {

    // Hook to get the current focus state of the screen. Returns a true if screen is focused.
    const isFocused = useIsFocused()

    // @message stores the message that is sent to the Loader component
    const [message, setMessagee] = useState('')

    // The following 4 lines make the use of the exported functions in the hooks be possible
    const { setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather, loadCurrencyData } = useAllData()
    const { setCoords, setGeoData } = useLocation()
    const { setWeatherCoords, setWeatherData, setDaily, setHourly } = useWeather()
    const { SetCurrencyData } = useCurrency()

    // Variables used to control the permissions and access to the internet
    const [hasLocationPermission, setLocationPermission] = useState(false)
    const [hasCameraPermission, setCameraPermission] = useState(false)
    const [hasNetwork, setHasNetwork] = useState(false)

    // This function sets the 'message'
    function setMessage(newMessage: string) {
        //console.log(`> Loading Page => Setting new Message: ${newMessage}`)
        setMessagee(newMessage.replace('. ', '.\n'))
    }

    /**
     * These following methods iare called everytime the page is focused.
     * They ask for permissions and test the internet connection
     */
    useEffect(() => {
        if (!isFocused)
            return
        //
        if (!hasNetwork) {
            setMessage('Waiting for internet connection')
            Network.getNetworkStateAsync()
                .then(networkResponse => {
                    if (networkResponse.isInternetReachable)
                        setHasNetwork(networkResponse.isInternetReachable)
                })
        }

    }, [isFocused])

    useEffect(() => {
        if (!isFocused || !hasNetwork)
            return
        //
        if (!hasLocationPermission) {
            setMessage('Waiting for Location Permission')
            getLocationPermission().then(setLocationPermission)
        }

    }, [isFocused, hasNetwork])

    useEffect(() => {
        if (!isFocused || !hasNetwork || !hasLocationPermission)
            return
        //
        if (!hasCameraPermission) {
            setMessage('Waiting for Camera Permission')
            getCameraPermission().then(setCameraPermission)
        }

    }, [isFocused, hasNetwork, hasLocationPermission])

    /**
     * This function is the most important to the load process.
     * It works with the 'useAllData()' context to get all information from
     * the database or api's and setting the state in the hooks.
     */
    async function loadData() {

        // await dropTablesDb()
        // await DeleteInfo('CurrentCoord')

        // It will wait until the user answer if they want to load the
        // last location saved or the current one
        const AsyncAlert = (): Promise<string> => {
            return new Promise((resolve, reject) => {
                Alert.alert(
                    'Choose Location',
                    'Would you like to load your current or last location saved?',
                    [
                        {
                            text: 'Current',
                            onPress: () => resolve('current')
                        },
                        {
                            text: 'Last',
                            onPress: () => resolve('last')
                        }
                    ],
                    { cancelable: false }
                )
            })
        }

        let loadFrom = 'current'

        const locationStorage = await GetInfo('CurrentCoord')
        //
        if (!!locationStorage)
            loadFrom = await AsyncAlert()

        setMessage(`Loading ${loadFrom} location`)
        //
        // Get the last/current coordinate
        let coords = await loadCoord(loadFrom)

        // If got, saves to the database and AsyncStorage
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

        // Get the GeoLocation from database/api
        const geoResp = await loadGeoLocation(coords)

        geoResp.coords = coords
        geoResp.coordId = coords.id

        setGeoData(geoResp)

        setMessage('Geo Location set. Reading currency from location')

        setMessage('Currency Base set. Loading currency rates')

        // Get Currency from database/api
        const currResp = await loadCurrencyData(geoResp.currency_code)

        SetCurrencyData(currResp)

        setMessage('Currency Rates set. Starting loading weather info')

        setWeatherCoords(coords)

        // Get Weather from database/api
        const weatherResp = await loadWeather(coords)

        setWeatherData(weatherResp)

        setMessage('Loading Daily Weather')

        // Get Daily Forecast from database/api
        const dailyResp = await loadDailyWeather(weatherResp.id, coords)

        setDaily(dailyResp)

        setMessage('Loading Hourly Weather')

        // Get Hourly Forecast from database/api
        const hourlyResp = await loadHourlyWeather(weatherResp.id, coords)

        setHourly(hourlyResp)

        setLoading(false)

    }

    // Once permissions are granted and app has internet connection, it calls loadData method
    useEffect(() => {
        if (!isFocused || !hasNetwork || !hasCameraPermission || !hasLocationPermission)
            return
        //
        loadData()

    }, [isFocused, hasCameraPermission, hasLocationPermission, hasNetwork])

    return <Loader message={message} />
}

export default Loading
