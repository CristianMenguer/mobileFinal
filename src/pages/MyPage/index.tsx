import React, { useEffect, useContext } from 'react'
import { Text, View, Image } from 'react-native'

import { LocationContext } from '../../hooks/location'

import logoImg from '../../../assets/logo.jpg'

import Styles from './style'

const MyPage = () => {

    const { data, getCoords } = useContext(LocationContext)

    useEffect(() => {
        getCoords()
        console.log(data)
    }, [])

    return (
        <>
        <View style={Styles.container} >
            <Image
                source={logoImg}
                style={Styles.logo}
            />
            <Text>MyPage =D</Text>
            </View>
        </>
    )
}

export default MyPage
