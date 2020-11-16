import { useIsFocused } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'

import Styles from './style'

interface LoaderProps {
    message?: string
}

const Loader: React.FC<LoaderProps> = ({ message }) => {

    const [counter, setCounter] = useState(0)
    const [loadingMessage, setLoadingMessage] = useState('Loading...')

    useEffect(() => {
        let unmounted = false

        const textMessage = (message && message.length > 0) ? message : 'Loading'
        setLoadingMessage(textMessage + '.' + (counter > 0 ? '.' : '') + (counter > 1 ? '.' : ''))
        setTimeout(() => {
            if (!unmounted)
                setCounter((counter + 1) % 3)
        }, 1000
        )

        return () => {unmounted = true}
    }, [counter])

    return (
        <View style={Styles.container}  >
            <ActivityIndicator size={48} color='#00ff00' style={Styles.loader} />
            {/* <Text style={Styles.message} >{message}</Text> */}
            <Text style={Styles.message} >{loadingMessage}</Text>
        </View>
    )
}

export default Loader
