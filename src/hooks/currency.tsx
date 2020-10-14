import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetGurrencyRates } from '../services/CurrencyApi'
import { CURRENCY_TYPES } from '../constants/Currency'

interface DataInterface {
    [key: string]: number
}

interface CurrencyContextData {
    SetCurrencyBase(currencyBase: string): Promise<void>
    GetCurrencyRate(): DataInterface
    GetBase(): string
    GetRate(currencyTo: String): number
    data: DataInterface
}

const CurrencyContext = createContext<CurrencyContextData>({} as CurrencyContextData)

export const CurrencyProvider: React.FC = ({ children }) => {

    const [base, setBase] = useState<string>('')
    const [data, setData] = useState<DataInterface>(() => {
        var newArray: DataInterface = [] as unknown as DataInterface
        CURRENCY_TYPES.map(type => {
            newArray[type] = 0
        })
        return newArray
    })

    useEffect(() => {
        GetCurrencyDataApi(base)
    }, [base])

    const SetCurrencyBase = useCallback(async (currencyBase: string) => {
        if (!currencyBase)
            return
        //
        setBase(currencyBase)
    }, [])

    const GetCurrencyDataApi = useCallback(async (currencyBase: string) => {
        if (!currencyBase)
            return
        //
        const response = await GetGurrencyRates(currencyBase)
        //
        if (!response)
            return
        //
        var newData = data

        for (const key in response.data.rates) {
            newData[key as string] = response.data.rates[key]
        }
        //
        setData(newData)
        //
    }, [])

    const GetRate = useCallback((currencyTo: string) => {
        return data[currencyTo]
    }, [])

    const GetCurrencyRate = useCallback(() => data, [])
    const GetBase = useCallback(() => base, [])

    return (
        <CurrencyContext.Provider value={{ SetCurrencyBase, GetCurrencyRate, GetBase, GetRate, data }} >
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
