import React from 'react'
import { StyleSheet } from 'react-native'

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F4',
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    mapContainer: {
        flex: 1,
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 16,
        backgroundColor: 'blue'
    },
    map: {
        width: '100%',
        height: '100%'
    }
})

export default Styles
