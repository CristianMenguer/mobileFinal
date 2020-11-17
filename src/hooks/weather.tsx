import React, { createContext, useCallback, useState, useContext } from 'react'
import { GetWeather, GetWeatherDaily, GetWeatherHourly, GetWeatherIcon, GetWeatherHourlyIcon } from '../services/WeatherApi'

// This hook is used to keep all the weather/forecast information and the calls to
// get new weather/forecast info from the API.

// This is the interface of the return of this hook
interface WeatherContextData {
    setWeatherCoords(coords: Coordinate): void
    weatherData: Weather
    setWeatherData(props: Weather): void
    getWeatherDataApi(props: Coordinate): Promise<Weather>
    getForecastDailyApi(props: Coordinate): Promise<Forecast[]>
    getForecastHourlyApi(props: Coordinate): Promise<Forecast[]>
    forecastDaily: Forecast[]
    forecastHourly: Forecast[]
    setHourly(props: Forecast[]): void
    setDaily(props: Forecast[]): void

}

// This is the context of this hook
const WeatherContext = createContext<WeatherContextData>({} as WeatherContextData)

export const WeatherProvider: React.FC = ({ children }) => {

    // These are the weather/forecast objects that will be accessed by the app
    const [weatherData, setWeatherDataa] = useState<Weather>({} as Weather)
    const [forecastDaily, setForecastDaily] = useState<Forecast[]>([] as Forecast[])
    const [forecastHourly, setForecastHourly] = useState<Forecast[]>([] as Forecast[])

    // This function receives the new coordinates and set the one in this context
    const setWeatherCoords = useCallback(async (props: Coordinate) => {
        const newData = weatherData
        newData.coords = props
        setWeatherDataa(newData)
        //
    }, [])

    // This function receives the new weather object and set the one in this context
    const setWeatherData = useCallback((props: Weather) => {
        const newData = weatherData
        newData.id = props.id
        newData.coords = props.coords
        newData.temperature = props.temperature
        newData.feel_like = props.feel_like
        newData.description = props.description
        newData.iconCode = props.iconCode
        newData.iconUri = props.iconUri
        newData.temp_max = props.temp_max
        newData.temp_min = props.temp_min
        newData.timeAPI = props.timeAPI
        setWeatherDataa({ ...newData })
    }, [])

    // This function receives the coordinates and return the Weather Info
    // from this specific coordinate calling the API
    const getWeatherDataApi = useCallback(async (props: Coordinate) => {

        const response = await GetWeather({ latitude: props.latitude, longitude: props.longitude })
        //
        if (!response)
            return weatherData
        //
        const newData = weatherData
        newData.id = 0,
            newData.coords = props
        newData.coordsId = props.id
        newData.temperature = response.temp
        newData.temp_max = 0
        newData.temp_min = 0
        newData.feel_like = response.app_temp
        newData.description = response.weather.description
        newData.iconCode = response.weather.icon
        newData.iconUri = GetWeatherIcon(response.weather.icon)
        newData.timeAPI = new Date().getTime()
        setWeatherData(newData)
        //
        return newData
        //
    }, [])

    // This function receives the new daily forecast object and set the one in this context
    const setDaily = useCallback(async (props: Forecast[]) => {
        setForecastDaily(props)
    }, [])

    // This function receives the new hourly forecast object and set the one in this context
    const setHourly = useCallback(async (props: Forecast[]) => {
        setForecastHourly(props)
    }, [])

    // This function receives the coordinates and return the Daily Forecast
    // Weather Info from this specific coordinate calling the API
    const getForecastDailyApi = useCallback(async (props: Coordinate) => {

        const response = await GetWeatherDaily({ latitude: props.latitude, longitude: props.longitude })
        //
        if (!response)
            return
        //
        const newData = weatherData
        newData.temp_min = response[0].min_temp
        newData.temp_max = response[0].max_temp
        setWeatherData(newData)
        //
        const predict = forecastDaily
        while (predict.length)
            predict.pop()
        //
        for (let i = 0; i < response.length; i++) {
            const newForecast = {
                id: 0,
                type: 'daily',
                valid_date: (i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : response[i].valid_date.substring(8, 10) + '/' + response[i].valid_date.substring(5, 7))),
                temp: response[i].temp,
                min_temp: response[i].min_temp,
                max_temp: response[i].max_temp,
                min_feel_like: response[i].app_min_temp,
                max_feel_like: response[i].app_max_temp,
                pop: response[i].pop,
                description: response[i].weather.description,
                iconCode: response[i].weather.icon,
                iconUri: GetWeatherIcon(response[i].weather.icon),
                timeAPI: new Date().getTime(),
            } as Forecast
            //
            predict.push(newForecast)
        }
        setForecastDaily({ ...predict })
        return predict
    }, [])

    // This function receives the coordinates and return the Hourly Forecast
    // Weather Info from this specific coordinate calling the API
    const getForecastHourlyApi = useCallback(async (props: Coordinate) => {

        const response = await GetWeatherHourly({ latitude: props.latitude, longitude: props.longitude })
        //
        if (!response)
            return
        //
        const predict = forecastHourly
        while (predict.length)
            predict.pop()
        //
        for (let i = 0; i < response.length; i++) {
            const date = new Date(response[i].dt * 1000)
            //
            const newForecast = {
                id: 0,
                type: 'hourly',
                valid_date: (i === 0 ? 'Now' : date.getHours().toString() + 'h'),
                temp: response[i].temp,
                pop: (response[i].pop * 100),
                description: response[i].weather[0].description,
                iconCode: response[i].weather[0].icon,
                iconUri: GetWeatherHourlyIcon(response[i].weather[0].icon),
                timeAPI: new Date().getTime(),
                max_feel_like: response[i].feels_like,
                min_feel_like: response[i].feels_like,
                max_temp: 0,
                min_temp: 0,
                weatherId: 0,
            } as Forecast
            //
            predict.push(newForecast)
            //
            if (i === 23)
                break
            //
        }
        setForecastHourly({ ...predict })
        return predict
    }, [])

    return (
        <WeatherContext.Provider value={
            {
                setWeatherCoords,
                weatherData,
                setWeatherData,
                getWeatherDataApi,
                // @ts-ignore
                getForecastDailyApi, getForecastHourlyApi,
                forecastDaily,
                forecastHourly,
                setHourly,
                setDaily
            }
        } >
            {children}
        </WeatherContext.Provider>
    )
}

// This function is exported and used to give access to the components in this hook
function useWeather(): WeatherContextData {
    const context = useContext(WeatherContext)

    if (!context) {
        throw Error('useWeather must be used within an WeatherProvider!')
    }

    return context

}

export default useWeather
