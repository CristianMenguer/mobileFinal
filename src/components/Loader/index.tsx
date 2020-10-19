import React from 'react'
import { ActivityIndicator, View, Text } from 'react-native'

import Styles from './style'

interface LoaderProps {
    message?: string
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
    return (
        <View style={Styles.container}  >
            <ActivityIndicator size={48} color='#00ff00' style={Styles.loader} />
            <Text style={Styles.message} >{message}</Text>
        </View>
    )
}

export default Loader
