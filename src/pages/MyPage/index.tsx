import React from 'react'
import { Text, View, Image } from 'react-native'

import logoImg from '../../../assets/logo.jpg'

import Styles from './style'

const MyPage = () => {
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
