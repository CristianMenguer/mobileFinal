import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import Styles from './style'

const Loader = () => {
    return (
        <View style={Styles.container}  >
            <ActivityIndicator size='large' color='#00ff00' style={Styles.loader} />
        </View>
    )
}

export default Loader
