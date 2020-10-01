import React from 'react'
import { StyleSheet } from 'react-native'

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F4',
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1
    },
    weatherContainer: {
        flex: 1,
        borderRadius: 10,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
    mapContainer: {
        flex: 3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 16,
        backgroundColor: 'blue',
        width: '90%'
    },
    map: {
        width: '100%',
        height: '100%'
    }
})

export default Styles
