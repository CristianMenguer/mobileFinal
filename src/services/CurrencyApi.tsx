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

export const GetGurrencyRate = async (currencyCode: string, currencyCompare: string = 'USD'): Promise<CurrencyData> => {
    if (!currencyCode)
        return {} as CurrencyData
    //
    const url = `${baseURL}?base=${currencyCode}&symbols=${currencyCompare}`
    //
    try {
        const response = await axios.get(url)
        const rate: CurrencyData = {
            id: 0,
            currencyBase: currencyCode,
            currencyCompare,
            value: response.data.rates[currencyCompare] as number,
            timeAPI: new Date().getTime()

        }
        return rate
    } catch(e) {
        console.log('GetGurrencyRate: ' + e)
        console.log('url: ' + url)
    }
    //
    return {} as CurrencyData
}
