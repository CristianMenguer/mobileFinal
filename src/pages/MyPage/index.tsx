import React, { useEffect, useContext, useState } from 'react'
import { Text, View, Image } from 'react-native'

import useLocation from '../../hooks/location'
import { GetInfo } from '../../services/InfoStorage'

import Styles from './style'

interface Coordinates {
    latitude: string
    longitude: string
}

const MyPage: React.FC = () => {

    const { GetData } = useLocation()

    const [msg, setMsg] = useState('')

    useEffect(() => {
        setMsg((GetData().coords as Coordinates).latitude)
    }, [])

    return (
        <>
        <View style={Styles.container} >
            <Image
                source={require('../../../assets/logo.jpg')}
                style={Styles.logo}
            />
            <Text>MyPage =D</Text>
            <Text>{msg}</Text>
            </View>
        </>
    )
}

export default MyPage
