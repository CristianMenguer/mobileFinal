import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetGurrencyRates } from '../services/CurrencyApi'

interface CurrencyContextData {
    SetCurrencyBase(currencyBase: string): Promise<void>
    GetCurrencyRate(): number[]
}

const CurrencyContext = createContext<CurrencyContextData>({} as CurrencyContextData)

export const CurrencyProvider: React.FC = ({ children }) => {

    const [base, setBase] = useState<string>('')
    const [data, setData] = useState<number[] | any>([])

    const SetCurrencyBase = useCallback(async (currencyBase: string) => {
        if (!currencyBase)
            return
        //
        let newBase = base
        newBase = currencyBase
        setBase(newBase)
        setBase(currencyBase)
        console.log(newBase + '-' + GetBase())
        await GetCurrencyDataApi()
    }, [])

    const GetCurrencyDataApi = useCallback(async () => {

        console.log('base: ' + base)
        const response = await GetGurrencyRates(base)
        //
        if (!response)
            return
        //
        let newData = data
        for (const key in response.data.rates) {
            newData[key] = response.data.rates[key]
        }
        //
        setData(newData)
        //
    }, [])

    const GetCurrencyRate = useCallback(() => data, [])
    const GetBase = useCallback(() => base, [])

    return (
        <CurrencyContext.Provider value={{ SetCurrencyBase, GetCurrencyRate }} >
            {children}
        </CurrencyContext.Provider>
    )
}

function useCurrency(): CurrencyContextData {
    const context = useContext(CurrencyContext)

    if (!context) {
        throw Error('useCurrency must be used within an CurrencyProvider!')
    }

    return context

}

export default useCurrency
