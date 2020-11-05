import React from 'react'
import { StyleSheet } from 'react-native'

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F4',
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    mapContainer: {
        flex: 3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 16,
        backgroundColor: 'green',
        width: '90%'
    },
    itemsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    button: {
        backgroundColor: 'wheat',
        borderRadius: 16,
        height: 48,
        width: 240,
        justifyContent: 'center',
        alignItems: 'center'
    },
    map: {
        width: '100%',
        height: '100%',
        backgroundColor: 'blue'
    }
})

export default Styles
