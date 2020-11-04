import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetWeather, GetWeatherDaily, GetWeatherHourly, GetWeatherIcon } from '../services/WeatherApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'

interface WeatherContextData {
    setWeatherCoords(coords: Coordinate): void
    weatherData: Weather
    setWeatherData(props: Weather): void
    getWeatherDataApi(): Promise<Weather>
    getForecastDailyApi(): Promise<Forecast[]>
    getForecastHourlyApi(): Promise<Forecast[]>
    forecastDaily: Forecast[]
    forecastHourly: Forecast[]
    setHourly(props: Forecast[]): void
    setDaily(props: Forecast[]): void

}

const WeatherContext = createContext<WeatherContextData>({} as WeatherContextData)

export const WeatherProvider: React.FC = ({ children }) => {

    const [weatherData, setWeatherDataa] = useState<Weather>({} as Weather)
    const [forecastDaily, setForecastDaily] = useState<Forecast[]>([] as Forecast[])
    const [forecastHourly, setForecastHourly] = useState<Forecast[]>([] as Forecast[])

    const setWeatherCoords = useCallback(async (props: Coordinate) => {
        const newData = weatherData
        newData.coords = props
        setWeatherDataa(newData)
        //
    }, [])

    const setWeatherData = useCallback((props: Weather) => {
        const newData = weatherData
        newData.temperature = props.temperature
        newData.feel_like = props.feel_like
        newData.description = props.description
        newData.iconCode = props.iconCode
        newData.iconUri = props.iconUri
        newData.temp_max = props.temp_max
        newData.temp_min = props.temp_min
        newData.timeAPI = props.timeAPI
        setWeatherDataa({...newData})
    }, [])

    const getWeatherDataApi = useCallback(async () => {

        const response = await GetWeather({ ...weatherData.coords })
        //
        if (!response)
            return weatherData
        //
        const newData = weatherData
        newData.temperature = response.temp
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

    const setDaily = useCallback(async (props: Forecast[]) => {
        setForecastDaily(props)
    }, [])

    const setHourly = useCallback(async (props: Forecast[]) => {
        setForecastHourly(props)
    }, [])

    const getForecastDailyApi = useCallback(async () => {

        const response = await GetWeatherDaily({ ...weatherData.coords })
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
                id: i + 1,
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
        setForecastDaily({...predict})
        return predict
    }, [])

    const getForecastHourlyApi = useCallback(async () => {

        const response = await GetWeatherHourly({ ...weatherData.coords })
        //
        if (!response)
            return
        //
        const predict = forecastHourly
        while (predict.length)
            predict.pop()
        //
        for (let i = 0; i < response.length; i++) {
            const newForecast = {
                id: i + 1,
                valid_date: (i === 0 ? 'Now' : response[i].datetime.substring(11, 13) + 'h'),
                temp: response[i].temp,
                pop: response[i].pop,
                description: response[i].weather.description,
                iconCode: response[i].weather.icon,
                iconUri: GetWeatherIcon(response[i].weather.icon),
                timeAPI: new Date().getTime(),
            } as Forecast
            //
            predict.push(newForecast)
            //
            if (i === 23)
                break
            //
        }
        setForecastHourly({...predict})
        return predict
    }, [])

    return (
        <WeatherContext.Provider value={{ setWeatherCoords, weatherData, setWeatherData, getWeatherDataApi, getForecastDailyApi, getForecastHourlyApi, forecastDaily, forecastHourly, setHourly, setDaily }} >
            {children}
        </WeatherContext.Provider>
    )
}

function useWeather(): WeatherContextData {
    const context = useContext(WeatherContext)

    if (!context) {
        throw Error('useWeather must be used within an WeatherProvider!')
    }

    return context

}

export default useWeather
