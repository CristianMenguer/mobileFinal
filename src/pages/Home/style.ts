import React from 'react'
import { StyleSheet } from 'react-native'

const Styles = StyleSheet.create({
    fullContainer: {
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    container: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: 600,
    },
    logo: {
        width: 300,
        height: 79
    },
    text: {
        textAlign: 'center',
        maxWidth: '70%',

    },
    textName: {
        textAlign: 'center',
        maxWidth: '70%',
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 8,
    },
    logoWeather: {
        width: 80,
        height: 80,
        borderRadius: 25
    }
})

export default Styles
