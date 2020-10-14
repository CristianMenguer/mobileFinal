import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetWeather, GetWeatherDaily, GetWeatherHourly, GetWeatherIcon } from '../services/WeatherApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'

interface WeatherContextData {
    setWeatherCoords(coords: Coordinate): void
    getWeatherData(): Weather
    setWeatherData(props: Weather): void
    getWeatherDataApi(): Promise<Weather>
    getHourlyData(): Forecast[]
    getDailyData(): Forecast[]

}

const WeatherContext = createContext<WeatherContextData>({} as WeatherContextData)

export const WeatherProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<Weather>({} as Weather)
    const [forecastDaily, setForecastDaily] = useState<Forecast[]>([] as Forecast[])
    const [forecastHourly, setForecastHourly] = useState<Forecast[]>([] as Forecast[])

    const setWeatherCoords = useCallback(async (props: Coordinate) => {
        const newData = data
        newData.coords = props
        setData(newData)
        //
    }, [])

    const setWeatherData = useCallback((props: Weather) => {
        const newData = data
        newData.temperature = props.temperature
        newData.feel_like = props.feel_like
        newData.description = props.description
        newData.iconCode = props.iconCode
        newData.iconUri = props.iconUri
        newData.temp_max = props.temp_max
        newData.temp_min = props.temp_min
        newData.timeAPI = props.timeAPI
        setData(newData)
    }, [])

    const getWeatherDataApi = useCallback(async () => {

        const response = await GetWeather({ ...data.coords })
        //
        if (!response)
            return
        //
        const newData = data
        newData.temperature = response.temp
        newData.feel_like = response.app_temp
        newData.description = response.weather.description
        newData.iconCode = response.weather.icon
        newData.iconUri = GetWeatherIcon(response.weather.icon)
        newData.timeAPI = new Date().getTime()
        setWeatherData(newData)
        //
        getForecastDailyApi()
        getForecastHourlyApi()
        return newData
        //
    }, [])

    const getForecastDailyApi = useCallback(async () => {

        const response = await GetWeatherDaily({ ...data.coords })
        //
        if (!response)
            return
        //
        const newData = data
        newData.temp_min = response[0].min_temp
        newData.temp_max = response[0].max_temp
        setData(newData)
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
            } as Forecast
            //
            predict.push(newForecast)
        }
        console.log(predict)
        setForecastDaily(predict)
        console.log(forecastDaily)
    }, [])

    const getForecastHourlyApi = useCallback(async () => {

        const response = await GetWeatherHourly({ ...data.coords })
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
            } as Forecast
            //
            predict.push(newForecast)
            //
            if (i === 23)
                break
            //
        }
        setForecastHourly(predict)
    }, [])

    const getWeatherData = useCallback(() => data, [])

    const getDailyData = useCallback(() => forecastDaily, [])

    const getHourlyData = useCallback(() => forecastHourly, [])

    return (
        <WeatherContext.Provider value={{ setWeatherCoords, getWeatherData, setWeatherData, getWeatherDataApi, getDailyData, getHourlyData }} >
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
