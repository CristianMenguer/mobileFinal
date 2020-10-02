import React from 'react'
import { View } from 'react-native'

import Routes from './src/routes'

import Styles from './src/globalStyle'

export default function App() {
    return (
        <View style={Styles.container} >
            <Routes />
        </View>
    )
}
