import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import * as ExpoLocation from 'expo-location'
import { getLocationPermission } from './../../services/Permissions'
import { GetGeo } from '../../services/GeoApi'

import Styles from './style'

interface Coordinates {
    latitude: number
    longitude: number
}

interface GeoLocation {
    place: string
    city: string
    country: string
}

interface Currency {
    decimal_mark: string
    iso_code: string
    name: string
    subunit: string
    symbol: string
    symbol_first: string
    thousands_separator: string
}

const Location = () => {

    const [hasPermission, setHasPermission] = useState(false)
    const [coords, setCoords] = useState<Coordinates>()
    const [geoLocation, setGeoLocation] = useState<GeoLocation>()
    const [flag, setFlag] = useState()
    const [currency, setCurrency] = useState<Currency>()

    useEffect(() => {
        getLocationPermission().then(data => {
            setHasPermission(data)
        })
    }, [])

    useEffect(() => {
        if (hasPermission) {
            ExpoLocation.getCurrentPositionAsync({
                accuracy: ExpoLocation.Accuracy.Highest
            })
                .then(data => {
                    setCoords(data.coords)
                })
        }
    }, [hasPermission])

    useEffect(() => {
        if (coords) {
            GetGeo(coords)
            // GetGeo({latitude: -29.737645, longitude: -51.137464})
                .then(data => {
                    setGeoLocation(data.components)
                    setFlag(data.annotations.flag)
                    setCurrency(data.annotations.currency)


                    console.log(data)
                })
        }
    }, [coords])

    if (!!!geoLocation)
        return <Text>Loading</Text>

    return (
        <>
            <View style={Styles.container} >
                <Text>{geoLocation.place}</Text>
                <Text>{geoLocation.city}</Text>
                <Text>{`${geoLocation.country} ${flag}`}</Text>
                <Text>{`${currency?.name} (${currency?.symbol})`}</Text>
            </View>
        </>
    )
}

export default Location
