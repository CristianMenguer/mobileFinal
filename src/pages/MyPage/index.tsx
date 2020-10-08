import React, { useEffect, useContext } from 'react'
import { Text, View, Image } from 'react-native'

import { LocationContext } from '../../hooks/location'

import Styles from './style'

const MyPage = () => {

    const { data, getCoordsDevice } = useContext(LocationContext)

    useEffect(() => {
        getCoordsDevice()
        console.log(data)
    }, [])

    return (
        <>
        <View style={Styles.container} >
            <Image
                source={require('../../../assets/logo.jpg')}
                style={Styles.logo}
            />
            <Text>MyPage =D</Text>
            </View>
        </>
    )
}

export default MyPage
