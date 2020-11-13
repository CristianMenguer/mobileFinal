import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { GetGeo } from '../services/GeoApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'
import { getLocationPermission } from '../services/Permissions'

interface LocationContextData {
    setCoords(coords: Coordinate): Promise<void>
    setGeoData(props: GeoLocation): void
    getGeoDataApi(props: Coordinate): Promise<GeoLocation>
    locationData: GeoLocation
}

const LocationContext = createContext<LocationContextData>({} as LocationContextData)

export const LocationProvider: React.FC = ({ children }) => {

    const [locationData, setLocationData] = useState<GeoLocation>({} as GeoLocation)

    const setCoords = useCallback(async (props: Coordinate) => {
        let newData = locationData
        newData.coords = props
        setLocationData({ ...newData })
        //
    }, [])

    const getGeoDataApi = useCallback(async (props: Coordinate) => {

        const response = await GetGeo({ latitude: props.latitude, longitude: props.longitude })
        //
        if (!response)
            return locationData
        //
        let city = 'City not found!'
        if (response.components.town)
            city = response.components.town
        else if (response.components.city)
            city = response.components.city
        else if (response.components.city_district)
            city = response.components.city_district
        else if (response.components.village)
            city = response.components.village
        else if (response.components.road)
            city = response.components.road
        else if (response.components.suburb)
            city = response.components.suburb
        else if (response.components.state)
            city = response.components.state
        //
        let newData = locationData
        newData.formatted = response.formatted
        newData.city = city
        newData.county = response.components.county
        newData.country = response.components.country
        newData.currency_name = response.annotations.currency.name
        newData.currency_code = response.annotations.currency.iso_code
        newData.flag = response.annotations.flag
        newData.image_uri = ''
        setGeoData(newData)
        //
        return newData
    }, [])

    const setGeoData = useCallback((props: GeoLocation) => {
        let newData = locationData
        newData.formatted = props.formatted
        newData.id = props.id
        newData.coords = props.coords
        newData.coordId = props.coordId
        newData.city = props.city
        newData.county = props.county
        newData.country = props.country
        newData.currency_name = props.currency_name
        newData.currency_code = props.currency_code
        newData.flag = props.flag
        newData.image_uri = props.image_uri
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
