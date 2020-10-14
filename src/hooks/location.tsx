import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetGeo } from '../services/GeoApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'
import { getLocationPermission } from '../services/Permissions'

interface LocationContextData {
    setCoords(coords: Coordinate): Promise<void>
    setGeoData(props: GeoLocation): void
    getGeoDataApi(): Promise<GeoLocation>
    GetGeoData(): GeoLocation
    getLoading(): boolean
}

const LocationContext = createContext<LocationContextData>({} as LocationContextData)

export const LocationProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<GeoLocation>({} as GeoLocation)

    const setCoords = useCallback(async (props: Coordinate) => {
        let newData = data
        data.coords = props
        setData(newData)
        //
    }, [])

    const getGeoDataApi = useCallback(async () => {

        const response = await GetGeo({ ...data.coords })
        //
        if (!response)
            return
        //
        let newData = data
        newData.formatted = response.formatted
        newData.city = response.components.city
        newData.county = response.components.county
        newData.country = response.components.country
        newData.currency_name = response.annotations.currency.name
        newData.currency_code = response.annotations.currency.iso_code
        setGeoData(newData)
        //
        return newData
    }, [])

    const GetGeoData = useCallback(() => data, [])

    const setGeoData = useCallback((props: GeoLocation) => {
        let newData = data
        newData.formatted = props.formatted
        newData.city = props.city
        newData.county = props.county
        newData.country = props.country
        newData.currency_name = props.currency_name
        newData.currency_code = props.currency_code
        setData(newData)
        // setData(props)
    }, [])

    return (
        <LocationContext.Provider value={{ setCoords, setGeoData, getGeoDataApi, GetGeoData }} >
            {children}
        </LocationContext.Provider>
    )
}

function useLocation(): LocationContextData {
    const context = useContext(LocationContext)

    if (!context) {
        throw Error('useLocation must be used within an LocationProvider!')
    }

    return context

}

export default useLocation
