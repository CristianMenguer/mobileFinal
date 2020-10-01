import React from 'react'
import { Text, View, Image } from 'react-native'

import logoImg from '../../../assets/logo.jpg'

import Styles from './style'

const Currency = () => {
    return (
        <>
        <View style={Styles.container} >
            <Image
                source={logoImg}
                style={Styles.logo}
            />
            <Text>Currency =D</Text>
            </View>
        </>
    )
}

export default Currency
