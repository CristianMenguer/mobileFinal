import axios from 'axios'

const baseURL = 'https://api.opencagedata.com/geocode/v1/json'
const key = '132b1ab916da4e598e23e04fbcf24d74'

export const GetGeo = async (coords: Coordinate) => {
    if (isNaN(coords.latitude) || isNaN(coords.longitude))
        return null
    //
    const url = `${baseURL}?q=${coords.latitude}%2C${coords.longitude}&key=${key}&language=en&pretty=1`
    //
    try {
        const response = await axios.get(url)
        return response.data.results[0]
    } catch(e) {
        console.log('GetGeo: ' + e)
        console.log('url: ' + url)
    }
    //
    return null
}
