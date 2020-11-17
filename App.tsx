import React from 'react'
import { View } from 'react-native'

import AppProvider from './src/hooks/index'
import Routes from './src/routes'

import Styles from './src/style/global'

// This file wraps the whole app inside the global style,
// the providers to use the hooks and calls the router index

const App: React.FC = () => {
    return (
        <View style={Styles.container} >
            <AppProvider >
                <Routes />
            </AppProvider>
        </View>
    )
}

export default App
