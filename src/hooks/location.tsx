import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetGeo } from '../services/GeoApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'
import { getLocationPermission } from '../services/Permissions'

interface LocationContextData {
    setCoords(coords: Coordinate): Promise<void>
    setGeoData(props: GeoLocation): void
    getGeoDataApi(): Promise<GeoLocation>
    locationData: GeoLocation
}

const LocationContext = createContext<LocationContextData>({} as LocationContextData)

export const LocationProvider: React.FC = ({ children }) => {

    const [locationData, setLocationData] = useState<GeoLocation>({} as GeoLocation)

    const setCoords = useCallback(async (props: Coordinate) => {
        let newData = locationData
        newData.coords = props
        setLocationData({...newData})
        //
    }, [])

    const getGeoDataApi = useCallback(async () => {

        const response = await GetGeo({ ...locationData.coords })
        //
        if (!response)
            return locationData
        //
        let newData = locationData
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

    const setGeoData = useCallback((props: GeoLocation) => {
        let newData = locationData
        newData.formatted = props.formatted
        newData.id = props.id
        newData.coords = props.coords
        newData.coordsId = props.coordsId
        newData.city = props.city
        newData.county = props.county
        newData.country = props.country
        newData.currency_name = props.currency_name
        newData.currency_code = props.currency_code
        setLocationData(newData)
        // setData(props)
    }, [])

    return (
        <LocationContext.Provider value={{ setCoords, setGeoData, getGeoDataApi, locationData }} >
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
