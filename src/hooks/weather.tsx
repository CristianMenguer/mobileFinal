import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetWeather, GetWeatherIcon } from '../services/WeatherApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'

interface Coordinates {
    latitude: number
    longitude: number
}

interface Weather {
    coords: Coordinates
    temperature: number
    description: string
    iconCode: string
    iconUri: string
}

interface WeatherContextData {
    setWeatherCoords(coords: Coordinates): Promise<void>
    GetWeatherData(): Weather

}

const WeatherContext = createContext<WeatherContextData>({} as WeatherContextData)

export const WeatherProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<Weather>({} as Weather)

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
        newData.description = response.weather.description
        newData.iconCode = response.weather.icon
        newData.iconUri = GetWeatherIcon(response.weather.icon)
        setData(newData)
        //
    }, [])

    const GetWeatherData = useCallback(() => data, [])

    return (
        <WeatherContext.Provider value={{ setWeatherCoords, GetWeatherData }} >
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
