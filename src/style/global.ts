import React from 'react'
import { StyleSheet } from 'react-native'
import Constants from 'expo-constants'

// This file is a global style, only sets a marginTop
// in order to avoid any data being hidden by "notch's"

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight
    }
})

export default Styles
