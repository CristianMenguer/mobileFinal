import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetGurrencyRates } from '../services/CurrencyApi'
import { CURRENCY_TYPES } from '../constants/Currency'

interface CurrencyContextData {
    SetCurrencyBase(newCurrencyBase: string): Promise<void>
    SetCurrencyData(props: CurrencyData): void
    currencyBase: string
    GetRate(currencyTo: String): number
    currencyData: CurrencyData
    GetCurrencyDataApi(props: string): Promise<CurrencyData>
}

const CurrencyContext = createContext<CurrencyContextData>({} as CurrencyContextData)

export const CurrencyProvider: React.FC = ({ children }) => {

    const [currencyBase, setCurrencyBase] = useState('')
    const [currencyData, setCurrencyData] = useState<CurrencyData>(() => {
        const newArray: CurrencyData = [] as unknown as CurrencyData
        CURRENCY_TYPES.map(type => {
            newArray[type] = 0
        })
        return newArray
    })

    const SetCurrencyData = useCallback(async (props: CurrencyData) => {
        if (!props || !props.timeAPI)
            return
        //
        setCurrencyData(props)
    }, [])

    const SetCurrencyBase = useCallback(async (newCurrencyBase: string) => {
        if (!newCurrencyBase)
            return
        //
        setCurrencyBase(newCurrencyBase)
    }, [])

    const GetCurrencyDataApi = useCallback(async (props: string) => {
        if (!!!props)
            return {} as CurrencyData
        //
        const response = await GetGurrencyRates(props)
        //
        if (!response)
            return {} as CurrencyData
        //
        const newData = currencyData
        //
        for (const key in response.data.rates)
            newData[key as string] = response.data.rates[key]
        //
        newData.timeAPI = new Date().getTime()
        //
        setCurrencyData(newData)
        //
        return newData
    }, [])

    const GetRate = useCallback((currencyTo: string) => {
        return currencyData[currencyTo]
    }, [])

    return (
        <CurrencyContext.Provider value={{ SetCurrencyBase, SetCurrencyData, currencyBase, GetRate, currencyData, GetCurrencyDataApi }} >
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
