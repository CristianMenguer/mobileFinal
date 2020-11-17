import React, { useState, useEffect } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'

import Styles from './style'

// This component was created to be shown on screen while something is loading

// Interface used to declare the props coming from the call
interface LoaderProps {
    message?: string
}

const Loader: React.FC<LoaderProps> = ({ message }) => {

    const [counter, setCounter] = useState(0)
    const [loadingMessage, setLoadingMessage] = useState('Loading...')

    useEffect(() => {
        // This useEffect is called everytime the variable is set, each 1 second.
        // It is used to set the message with '.', or '..' or '...', to show that
        // something is happened and the app is not blocked
        let unmounted = false

        // If there is a message sent, it will be used.
        // Otherwise the message on screen will be 'Loading'
        const textMessage = (message && message !== '') ? message : 'Loading'
        setLoadingMessage(textMessage + '.' + (counter > 0 ? '.' : '') + (counter > 1 ? '.' : ''))
        setTimeout(() => {
            if (!unmounted)
                setCounter((counter + 1) % 3)
        }, 1000
        )

        return () => {unmounted = true}
    }, [counter])

    // This component only shows  the Loader and the message on screen
    return (
        <View style={Styles.container}  >
            <ActivityIndicator size={48} color='#00ff00' style={Styles.loader} />
            <Text style={Styles.message} >{loadingMessage}</Text>
        </View>
    )
}

export default Loader
