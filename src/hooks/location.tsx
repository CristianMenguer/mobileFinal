import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import * as ExpoLocation from 'expo-location'
import { GetGeo } from '../services/GeoApi'
import { GetInfo, SetInfo } from '../services/InfoStorage'

interface Coordinates {
    latitude: number
    longitude: number
}
interface GeoLocation {
    coords: Coordinates
    road: string
    city_district: string
    place: string
    city: string
    county: string
    country: string
    formatted: string
}

interface LocationContextData {
    setCoords(coords: Coordinates): Promise<void>
    getCoordsDevice(): Promise<Coordinates>
    GetDataApi(): Promise<void>
    GetData(): GeoLocation
}

const LocationContext = createContext<LocationContextData>({} as LocationContextData)

export const LocationProvider: React.FC = ({ children }) => {

    const [data, setData] = useState<GeoLocation>({} as GeoLocation)
    const [isLoading, setLoading] = useState(true)

    const key = 'CurrentLocation'

    useEffect(() => {
        async function loadStorageData(): Promise<void> {
            const response = await GetInfo(key)
            if (!!response) {
                const responseObj = JSON.parse(response) as Coordinates
                setData(prevData => {
                    return {
                        ...prevData,
                        coords: responseObj
                    }
                })
            }

            setLoading(false)
        }

        loadStorageData()
    }, [])

    const setCoords = useCallback(async (props: Coordinates) => {
        let newData = data
        data.coords = props
        setData(newData)
        //
        const value = JSON.stringify(props)
        await SetInfo({ key, value })
    }, [])

    const getCoordsDevice = useCallback(async () => {
        const response = await ExpoLocation.getCurrentPositionAsync({
            accuracy: ExpoLocation.Accuracy.Highest
        })

        const { latitude, longitude } = response.coords

        const coords: Coordinates = { latitude, longitude }

        return coords

    }, [])

    const GetDataApi = useCallback(async () => {

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
        setData(newData)

        //
    }, [])

    const GetData = useCallback(() => data, [])

    return (
        <LocationContext.Provider value={{ getCoordsDevice, setCoords, GetDataApi, GetData }} >
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
