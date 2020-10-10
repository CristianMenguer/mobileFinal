import React from 'react'
import { Text, View, Image, ViewPropTypes } from 'react-native'

import { CURRENCY_TYPES } from '../../constants/Currency'

import Styles from './style'

const Currency: React.FC = () => {
    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/moneyIcon.png')}
                    style={Styles.logo}
                />
                <Text >You are in Ireland</Text>
                <Text >Your currency is Euro (EUR)</Text>

            </View>
        </>
    )
}

export default Currency
