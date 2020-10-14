import axios from 'axios'

const baseURL = 'https://api.exchangeratesapi.io/latest'

export const GetGurrencyRates = async (currencyCode: string) => {
    if (!currencyCode)
        return null
    //
    const url = `${baseURL}?base=${currencyCode}`
    //
    // console.log('url currency: ' + url)
    try {
        const response = await axios.get(url)
        return response
    } catch(e) {
        console.log('GetGurrencyRates: ' + e)
        console.log('url: ' + url)
    }
    //
    return null
}
