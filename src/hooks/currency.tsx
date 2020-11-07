import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetGurrencyRate } from '../services/CurrencyApi'
import { CURRENCY_TYPES } from '../constants/Currency'

interface CurrencyContextData {
    SetCurrencyData(props: CurrencyData): void
    currencyData: CurrencyData
    GetCurrencyDataApi(currBase: string, currCompare: string): Promise<CurrencyData>
}

const CurrencyContext = createContext<CurrencyContextData>({} as CurrencyContextData)

export const CurrencyProvider: React.FC = ({ children }) => {

    const [currencyData, setCurrencyData] = useState<CurrencyData>({} as CurrencyData)

    const SetCurrencyData = useCallback(async (props: CurrencyData) => setCurrencyData(props), [])

    const GetCurrencyDataApi = useCallback(async (currBase: string, currCompare: string = 'USD') => {
        if (!currBase || currBase == '')
            return {} as CurrencyData
        //
        const response = await GetGurrencyRate(currBase, currCompare)
        //
        if (!response)
            return {} as CurrencyData
        //
        let newData = response
        //
        newData.timeAPI = new Date().getTime()
        //
        setCurrencyData(newData)
        //
        return newData
    }, [])

    return (
        <CurrencyContext.Provider value={{ SetCurrencyData, currencyData, GetCurrencyDataApi }} >
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
