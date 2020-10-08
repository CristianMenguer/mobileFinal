import React, { createContext, useCallback, useState, useContext } from 'react'
import * as ExpoLocation from 'expo-location'
import { GetGeo } from '../services/GeoApi'
import * as SecureStore from 'expo-secure-store'

interface Coordinates {
    latitude: number
    longitude: number
}
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
    setCoords(coords: Coordinates): void
    getCoordsDevice(): Promise<Coordinates>
}

export const LocationContext = createContext<LocationContextData>({} as LocationContextData)

export const LocationProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<GeoLocation>({} as GeoLocation)

    const getCoordsDevice = useCallback(async () => {
        const response = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Highest
        })

        const { latitude, longitude } = response.coords

        const coords: Coordinates = {latitude, longitude }

        return coords

    }, [])

    const setCoords = useCallback(({ latitude, longitude }) => {
        console.log('setCoords')
        setData({
            ...data,
            latitude,
            longitude
        })
    }, [])

    const GetDataApi = useCallback(async () => {
        GetGeo({ latitude: data.latitude, longitude: data.longitude })
            .then(response => {
                setData({
                    ...data,
                    formatted: response.formatted,
                    //city
                })
                // setGeoLocation(data.components)
                // setGeoLocation({ ...data.components, formatted: data.formatted })
                // setFlag(data.annotations.flag)
                // setCurrency(data.annotations.currency)

                //console.log(data)
            })
        //
    }, [])

    return (
        <LocationContext.Provider value={{ data, getCoordsDevice, setCoords }} >
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
