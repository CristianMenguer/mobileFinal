import React, { createContext, useCallback, useState, useContext } from 'react'
import { GetGurrencyRate } from '../services/CurrencyApi'

// This hook is used to keep all the currency information and the calls to
// get new currency info from the API.

// This is the interface of the return of this hook
interface CurrencyContextData {
    SetCurrencyData(props: CurrencyData): void
    currencyData: CurrencyData
    GetCurrencyDataApi(currBase: string, currCompare: string): Promise<CurrencyData>
}

// This is the context of this hook
const CurrencyContext = createContext<CurrencyContextData>({} as CurrencyContextData)

export const CurrencyProvider: React.FC = ({ children }) => {

    // This is the currency object that will be accessed by the app
    const [currencyData, setCurrencyData] = useState<CurrencyData>({} as CurrencyData)

    // This function receives the new object and set the one in this context
    const SetCurrencyData = useCallback(async (props: CurrencyData) => setCurrencyData(props), [])

    // This function receives two currencies and return the rate between them
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

// This function is exported and used to give access to the components in this hook
function useCurrency(): CurrencyContextData {
    const context = useContext(CurrencyContext)

    if (!context) {
        throw Error('useCurrency must be used within an CurrencyProvider!')
    }

    return context

}

export default useCurrency
