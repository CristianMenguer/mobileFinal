import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetInfo, SetInfo } from '../services/InfoStorage'
import * as ExpoLocation from 'expo-location'
import useLocation from './location'
import useWeather from './weather'
import useCurrency from './currency'
import { AddGeoLocationDB, LoadGeoLocationDB } from '../models/Location'
import { AddCurrencyRateDB, LoadCurrencyRatesDB } from '../models/Currency'
import { AddWeatherDB, LoadWeatherDB } from '../models/Weather'
import { AddForecastDB, LoadForecastDB } from '../models/Forecast'

interface AllDataContextData {
    isLoading: boolean
    setLoading(newStatus: boolean): void
    loadCoord(): Promise<Coordinate>
    loadGeoLocation(props: number): Promise<GeoLocation>
    loadWeather(props: Coordinate): Promise<Weather>
    loadDailyWeather(weatherId: number, coords: Coordinate): Promise<Forecast[]>
    loadHourlyWeather(weatherId: number, coords: Coordinate): Promise<Forecast[]>
    loadCurrencyData(props: string): Promise<CurrencyData>
}

const AllDataContext = createContext<AllDataContextData>({} as AllDataContextData)

export const AllDataProvider: React.FC = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)

    const { getGeoDataApi } = useLocation()
    const { getWeatherDataApi, getForecastDailyApi, getForecastHourlyApi } = useWeather()
    const { GetCurrencyDataApi } = useCurrency()

    const loadCoord = useCallback(async () => {

        const locationStorage = await GetInfo('CurrentCoord')
        //
        if (!!locationStorage) {
            const { id, latitude, longitude } = JSON.parse(locationStorage)
            return {
                id,
                latitude,
                longitude
            } as Coordinate
            //
        }
        //
        const locationDevice = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Highest
        })
        //
        if (!!locationDevice) {
            const { latitude, longitude } = locationDevice.coords
            return {
                latitude,
                longitude
            } as Coordinate
        }

        //
        return {} as Coordinate
    }, [])

    const loadGeoLocation = useCallback(async (props: number) => {

        let geoLocation = await LoadGeoLocationDB(props)

        if (!geoLocation || !geoLocation.id || geoLocation.id < 1) {

            geoLocation = await getGeoDataApi()
            if (!!geoLocation) {
                geoLocation.coordsId = props
                geoLocation = await AddGeoLocationDB(geoLocation)
            }
            //
        }
        //
        return geoLocation
    }, [])

    const loadWeather = useCallback(async (props: Coordinate) => {
        let weather = await LoadWeatherDB(props.id ? props.id : 0)

        if (!weather || !weather.id || weather.id < 1 || !weather.timeAPI || ((new Date().getTime() - weather.timeAPI) > (60000 * 30))) {
            weather = await getWeatherDataApi(props)
            if (!!weather)
                weather = await AddWeatherDB(weather)
            //
        }
        //
        return weather
    }, [])

    const loadCurrencyData = useCallback(async (currencyBase: string) => {
        let rates = await LoadCurrencyRatesDB(currencyBase)

        if (!rates || !rates.id || rates.id < 1 || !rates.timeAPI || ((new Date().getTime() - rates.timeAPI) > (60000 * 1440))) {
            rates = await GetCurrencyDataApi(currencyBase, 'USD')
            if (!!rates)
                rates = await AddCurrencyRateDB(rates)
            //
        }
        //
        return rates
    }, [])

    const loadDailyWeather = useCallback(async (weatherId: number, coords: Coordinate) => {
        let dailyWeather = await LoadForecastDB(weatherId, 'daily')

        if (dailyWeather.length < 1 || !dailyWeather[0]?.timeAPI || ((new Date().getTime() - dailyWeather[0]?.timeAPI) > (60000 * 30))) {
            dailyWeather = await getForecastDailyApi(coords)
            dailyWeather.map(async (forecast) => {
                forecast.weatherId = weatherId
                await AddForecastDB(forecast)
            })
        }
        //
        return dailyWeather
    }, [])

    const loadHourlyWeather = useCallback(async (weatherId: number, coords: Coordinate) => {
        let hourlyWeather = await LoadForecastDB(weatherId, 'hourly')

        if (hourlyWeather.length < 1 || !hourlyWeather[0]?.timeAPI || ((new Date().getTime() - hourlyWeather[0]?.timeAPI) > (60000 * 30))) {
            hourlyWeather = await getForecastHourlyApi(coords)
            hourlyWeather.map(async (forecast) => {
                forecast.weatherId = weatherId
                await AddForecastDB(forecast)
            })
        }
        //
        return hourlyWeather
    }, [])

    const setLoading = useCallback(async (newStatus: boolean) => {
        setIsLoading(newStatus)
    }, [])


    return (
        <AllDataContext.Provider value={{ isLoading, setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather, loadCurrencyData }} >
            {children}
        </AllDataContext.Provider>
    )
}

function useAllData(): AllDataContextData {
    const context = useContext(AllDataContext)

    if (!context) {
        throw Error('useAllData must be used within an AllDataProvider!')
    }

    return context

}

export default useAllData
