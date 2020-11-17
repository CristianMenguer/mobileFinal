import React, { createContext, useCallback, useState, useContext } from 'react'
import { GetInfo } from '../services/InfoStorage'
import * as ExpoLocation from 'expo-location'
import useLocation from './location'
import useWeather from './weather'
import useCurrency from './currency'
import { AddGeoLocationDB, LoadGeoLocationDB } from '../models/Location'
import { AddCurrencyRateDB, LoadCurrencyRatesDB } from '../models/Currency'
import { AddWeatherDB, LoadWeatherDB } from '../models/Weather'
import { AddForecastDB, LoadForecastDB } from '../models/Forecast'

// This is the interface of the return of this hook
interface AllDataContextData {
    isLoading: boolean
    setLoading(newStatus: boolean): void
    loadCoord(): Promise<Coordinate>
    loadGeoLocation(props: Coordinate): Promise<GeoLocation>
    loadWeather(props: Coordinate): Promise<Weather>
    loadDailyWeather(weatherId: number, coords: Coordinate): Promise<Forecast[]>
    loadHourlyWeather(weatherId: number, coords: Coordinate): Promise<Forecast[]>
    loadCurrencyData(props: string): Promise<CurrencyData>
}

// This is the context of this hook
const AllDataContext = createContext<AllDataContextData>({} as AllDataContextData)

export const AllDataProvider: React.FC = ({ children }) => {

    // This is a boolean object that will be accessed by the app in order
    // to know whether the app is still loading
    const [isLoading, setIsLoading] = useState(true)

    // it declares the functions from the other contexts
    const { getGeoDataApi } = useLocation()
    const { getWeatherDataApi, getForecastDailyApi, getForecastHourlyApi } = useWeather()
    const { GetCurrencyDataApi } = useCurrency()

    /**
     * This function loads the coordinates from the AsyncStorage, if it is found, returns it.
     * If it is not, gets from the device location and returns it.
     */
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

    /**
     * This function receives the coordinate and tries to retrieve from the database
     * the Geo Location info.
     * If it is not found, gets from the API and saves to the database.
     * And then returns it.
     */
    const loadGeoLocation = useCallback(async (props: Coordinate) => {

        let geoLocation = await LoadGeoLocationDB(props.id ? props.id : 0)

        if (!geoLocation || !geoLocation.id || geoLocation.id < 1) {

            geoLocation = await getGeoDataApi(props)
            if (!!geoLocation) {
                geoLocation.coordId = props.id
                geoLocation.coords = props
                geoLocation = await AddGeoLocationDB(geoLocation)
            }
            //
        }
        //
        return geoLocation
    }, [])

    /**
     * This function receives the coordinate and tries to retrieve from the database
     * the Weather info.
     * If it is not found or it is older than 30 minutes, gets from the API and saves to the database.
     * And then returns it.
     */
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

    /**
     * This function receives the currency base and tries to retrieve from the database
     * the Currency info.
     * If it is not found or it is older than 1 day, gets from the API and saves to the database.
     * And then returns it.
     */
    const loadCurrencyData = useCallback(async (currencyBase: string) => {
        let rates = await LoadCurrencyRatesDB(currencyBase)

        if (!rates || !rates.id || rates.id < 1 || !rates.timeAPI || ((new Date().getTime() - rates.timeAPI) > (60000 * 1440))) {
            rates = await GetCurrencyDataApi(currencyBase, 'USD')

            if (!!rates && rates.value > 0)
                rates = await AddCurrencyRateDB(rates)
            //
        }
        //
        return rates
    }, [])

    /**
     * This function receives the coordinates and the weather id,
     * and tries to retrieve from the database the Daily Forecast info.
     * If it is not found or it is older than 30 minutes, gets from the API and saves to the database.
     * And then returns it.
     */
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

    /**
     * This function receives the coordinates and the weather id,
     * and tries to retrieve from the database the Hourly Forecast info.
     * If it is not found or it is older than 30 minutes, gets from the API and saves to the database.
     * And then returns it.
     */
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

    // This function receive a boolean to set the variable isLoading
    const setLoading = useCallback(async (newStatus: boolean) => {
        setIsLoading(newStatus)
    }, [])


    return (
        <AllDataContext.Provider value={{ isLoading, setLoading, loadCoord, loadGeoLocation, loadWeather, loadDailyWeather, loadHourlyWeather, loadCurrencyData }} >
            {children}
        </AllDataContext.Provider>
    )
}

// This function is exported and used to give access to the components in this hook
function useAllData(): AllDataContextData {
    const context = useContext(AllDataContext)

    if (!context) {
        throw Error('useAllData must be used within an AllDataProvider!')
    }

    return context

}

export default useAllData
