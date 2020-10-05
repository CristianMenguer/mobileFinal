import React, { createContext, useCallback, useState, useContext } from 'react'
import * as ExpoLocation from 'expo-location'
import { GetGeo } from '../services/GeoApi'

interface GeoLocation {
    latitude: number
    longitude: number
    road: string
    city_district: string
    place: string
    city: string
    country: string
    formatted: string
}

interface LocationContextData {
    data: GeoLocation
    // setCoords(coords: Coordinates): Promise<void>
    getCoords(): void
}

export const LocationContext = createContext<LocationContextData>({} as LocationContextData)

export const LocationProvider: React.FC = ({ children }) => {

    const [ data, setData ] = useState<GeoLocation>(() => {
        const latitude = 0
        const longitude = 1

        // if (latitude && longitude) {
        //     return {
        //         latitude,
        //         longitude
        //     }
        // }

        return {} as GeoLocation
    })

    const getCoords = useCallback(async () => {
        const response = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Highest
        })

        const { latitude, longitude } = response.coords

        const data: GeoLocation = {} as GeoLocation

        data.latitude = latitude
        data.longitude = longitude

        setData(data)

    }, [])

    return (
        <LocationContext.Provider value={{ data, getCoords }} >
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
