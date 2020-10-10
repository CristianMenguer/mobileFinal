import axios from 'axios'

const key = '997183acfd5f458c88bab53c9ccc89d7'

interface GetWeatherProps {
    latitude: number
    longitude: number
}

export const GetWeather = async (coords: GetWeatherProps) => {
    const baseURL = 'https://api.weatherbit.io/v2.0/current'

    if (isNaN(coords.latitude) || isNaN(coords.longitude))
        return null
    //
    const url = `${baseURL}?lat=${coords.latitude}&lon=${coords.longitude}&key=${key}`
    //
    try {
        const response = await axios.get(url)
        return response.data.data[0]
    } catch (e) {
        console.log('GetGeo: ' + e)
        console.log('url: ' + url)
    }
    return null
}

export const GetWeatherIcon = (code: string) => {
    const url = `https://www.weatherbit.io/static/img/icons/${code}.png`

    return url
}

export const GetWeatherForecast = async (coords: GetWeatherProps) => {
    const baseURL = 'https://api.weatherbit.io/v2.0/forecast/daily'

    if (isNaN(coords.latitude) || isNaN(coords.longitude))
        return null
    //
    const url = `${baseURL}?lat=${coords.latitude}&lon=${coords.longitude}&key=${key}`
    //
    try {
        const response = await axios.get(url)
        return response.data.data
    } catch (e) {
        console.log('GetGeo: ' + e)
        console.log('url: ' + url)
    }
    return null
}
