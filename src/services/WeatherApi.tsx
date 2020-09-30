import axios from 'axios'

const baseURL = 'https://api.weatherbit.io/v2.0/current'
const key = '997183acfd5f458c88bab53c9ccc89d7'


interface GetWeatherProps {
    latitude: number
    longitude: number
}

export const GetWeather = async (coords: GetWeatherProps) => {
    const url = `${baseURL}?lat=${coords.latitude}&lon=${coords.longitude}&key=${key}`
    //
    const response = await axios.get(url)
    //
    return response.data.data[0]
}

export const GetWeatherIcon = (code: string) => {
    const url = `https://www.weatherbit.io/static/img/icons/${code}.png`

    return url
}
