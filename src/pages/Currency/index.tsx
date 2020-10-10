import React from 'react'
import { Text, View, Image } from 'react-native'

import Styles from './style'

const Currency = () => {
    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/moneyIcon.png')}
                    style={Styles.logo}
                />
                <Text>Currency =D</Text>
            </View>
        </>
    )
}

export default Currency
