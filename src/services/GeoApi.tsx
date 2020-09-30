import axios from 'axios'

const baseURL = 'https://api.opencagedata.com/geocode/v1/json'
const key = '132b1ab916da4e598e23e04fbcf24d74'


interface GetGeoProps {
    latitude: number
    longitude: number
}

export const GetGeo = async (coords: GetGeoProps) => {
    const url = `${baseURL}?q=${coords.latitude}%2C${coords.longitude}&key=${key}&language=en&pretty=1`
    //
    const response = await axios.get(url)
    //
    return response.data.results[0]
}
