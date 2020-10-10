import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetWeather, GetWeatherForecast, GetWeatherIcon } from '../services/WeatherApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'

interface Coordinates {
    latitude: number
    longitude: number
}

interface Weather {
    coords: Coordinates
    temperature: number
    temp_min: number
    temp_max: number
    feel_like: number
    description: string
    iconCode: string
    iconUri: string
}

interface Forecast {
    id: number
    valid_date: string
    temp: number
    min_temp: number
    max_temp: number
    min_feel_like: number
    max_feel_like: number
    pop: number
    description: string
    iconCode: string
    iconUri: string
}

interface WeatherContextData {
    setWeatherCoords(coords: Coordinates): Promise<void>
    GetWeatherData(): Weather
    GetForecastData(): Forecast[]

}

const WeatherContext = createContext<WeatherContextData>({} as WeatherContextData)

export const WeatherProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<Weather>({} as Weather)
    const [forecast, setForecast] = useState<Forecast[]>([] as Forecast[])

    const setWeatherCoords = useCallback(async (props: Coordinates) => {
        const newData = data
        newData.coords = props
        //
        await GetWeatherDataApi()
    }, [])

    const GetWeatherDataApi = useCallback(async () => {

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
        setData(newData)
        await GetForecastApi()
        //
    }, [])

    const GetForecastApi = useCallback(async () => {

        const response = await GetWeatherForecast({ ...data.coords })
        //
        if (!response)
            return
        //
        const newData = data
        newData.temp_min = response[0].min_temp
        newData.temp_max = response[0].max_temp
        setData(newData)
        //
        const predict = forecast
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
        setForecast(predict)
    }, [])

    const GetWeatherData = useCallback(() => data, [])

    const GetForecastData = useCallback(() => forecast, [])

    return (
        <WeatherContext.Provider value={{ setWeatherCoords, GetWeatherData, GetForecastData }} >
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
