import React from 'react'
import { View } from 'react-native'
import { Picker } from '@react-native-community/picker'

import { CURRENCY_TYPES } from '../../constants/Currency'

import Styles from './style'

const Select: React.FC = () => {
    return (
        <View style={Styles.container}  >
            <Picker
                style={{ height: 50, width: 200 }}
                selectedValue={'USD'}
            >
                {CURRENCY_TYPES.map(item => (
                    <Picker.Item key={item} label={item} value={item} />
                ))
                }
            </Picker>
        </View>
    )
}

export default Select
