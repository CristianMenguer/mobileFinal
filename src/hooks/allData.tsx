import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'

interface AllDataContextData {
    isLoading: boolean
    setLoading(newStatus: boolean): void
}

const AllDataContext = createContext<AllDataContextData>({} as AllDataContextData)

export const AllDataProvider: React.FC = ({ children }) => {

    const [ isLoading, setIsLoading] = useState(true)

    const setLoading = useCallback(async (newStatus: boolean) => {
        setIsLoading(newStatus)
    }, [])

    return (
        <AllDataContext.Provider value={{ isLoading, setLoading }} >
            {children}
        </AllDataContext.Provider>
    )
}

function useAllData(): AllDataContextData {
    const context = useContext(AllDataContext)

    if (!context) {
        throw Error('useAllData must be used within an AllDataProvider!')
    }

    return context

}

export default useAllData
