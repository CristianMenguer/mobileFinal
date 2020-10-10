import React from 'react'
import { Text, View, Image } from 'react-native'

import Select  from '../../components/Select'

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
                <Select  />
                <Select  />
            </View>
        </>
    )
}

export default Currency
