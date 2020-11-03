import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetInfo, SetInfo } from '../services/InfoStorage'
import * as ExpoLocation from 'expo-location'
import useLocation from './location'
import useWeather from './weather'
import useCurrency from './currency'

interface AllDataContextData {
    isLoading: boolean
    setLoading(newStatus: boolean): void
    loadCoord(): Promise<Coordinate>
    loadGeoLocation(): Promise<GeoLocation>
    loadWeather(): Promise<Weather>
    loadDailyWeather(): Promise<Forecast[]>
    loadHourlyWeather(): Promise<Forecast[]>
    loadCurrencyData(props: string): Promise<CurrencyData>
}

const AllDataContext = createContext<AllDataContextData>({} as AllDataContextData)

export const AllDataProvider: React.FC = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true)

    const { getGeoDataApi } = useLocation()
    const { getWeatherDataApi, getForecastDailyApi, getForecastHourlyApi } = useWeather()
    const { GetCurrencyDataApi } = useCurrency()

    const loadCoord = useCallback(async () => {

        const locationStorage = await GetInfo('CurrentLocation')
        //
        if (!!locationStorage) {
            const { latitude, longitude } = JSON.parse(locationStorage)
            return {
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

    const loadGeoLocation = useCallback(async () => {
        let geoLocation = {} as GeoLocation
        const geoLocationString = await GetInfo('GeoLocation')
        if (!!geoLocationString) {
            geoLocation = JSON.parse(geoLocationString)
            //
        } else {
            geoLocation = await getGeoDataApi()
            if (!!geoLocation)
                await SetInfo({
                    key: 'GeoLocation',
                    value: JSON.stringify(geoLocation)
                })
            //
        }
        //
        return geoLocation
    }, [])

    const loadWeather = useCallback(async () => {
        let weather: Weather = {} as Weather
        const weatherString = await GetInfo('Weather')

        if (!!weatherString)
            weather = JSON.parse(weatherString)
        //
        if (!weatherString || ((new Date().getTime() - weather.timeAPI) > (60000 * 30))) {
            weather = await getWeatherDataApi()
            await SetInfo({
                key: 'Weather',
                value: JSON.stringify(weather)
            })
        }
        //
        return weather
    }, [])

    const loadCurrencyData = useCallback(async (props: string) => {
        let rates: CurrencyData = {} as CurrencyData
        const ratesString = await GetInfo('CurrencyData')
        //
        if (!!ratesString)
            rates = JSON.parse(ratesString)
        //
        if (!rates.timeAPI || ((new Date().getTime() - rates.timeAPI) > (60000 * 1440))) {
            rates = await GetCurrencyDataApi(props)
            await SetInfo({
                key: 'CurrencyData',
                value: JSON.stringify(rates)
            })
        }
        //
        return rates
    }, [])

    const loadDailyWeather = useCallback(async () => {
        let dailyWeather: Forecast[] = []

        const dailyString = await GetInfo('DailyWeather')
        if (!!dailyString)
            dailyWeather = JSON.parse(dailyString)
        //
        if (dailyWeather.length < 1 || ((new Date().getTime() - dailyWeather[0]?.timeAPI) > (60000 * 30))) {
            dailyWeather = await getForecastDailyApi()
            if (!!dailyWeather)
                await SetInfo({
                    key: 'DailyWeather',
                    value: JSON.stringify(dailyWeather)
                })
            //
        }
        //
        return dailyWeather
    }, [])

    const loadHourlyWeather = useCallback(async () => {
        let hourlyWeather: Forecast[] = []

        const hourlyString = await GetInfo('HourlyWeather')
        if (!!hourlyString)
            hourlyWeather = JSON.parse(hourlyString)
        //
        if (hourlyWeather.length < 1 || ((new Date().getTime() - hourlyWeather[0]?.timeAPI) > (60000 * 30))) {
            hourlyWeather = await getForecastHourlyApi()
            if (!!hourlyWeather)
                await SetInfo({
                    key: 'HourlyWeather',
                    value: JSON.stringify(hourlyWeather)
                })
            //
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
