import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Text, View, Image, TextInput, Keyboard } from 'react-native'

import useLocation from '../../hooks/location'
import useCurrency from '../../hooks/currency'

import Styles from './style'
import { showToast } from '../../services/ShowToast'
import { useIsFocused } from '@react-navigation/native'

/**
 * This is the Currency Page.
 * In this page is possible to convert the currency of
 * the current location to USD and the other way around too.
 */

const Currency: React.FC = () => {

    // Get locationData and currencyData from the hooks
    const { locationData } = useLocation()
    const { currencyData } = useCurrency()

    // Hook to get the current focus state of the screen. Returns a true if screen is focused.
    const isFocused = useIsFocused()

    const [firstValue, setFirstValue] = useState('0.00')
    const [secondValue, setSecondValue] = useState('0.00')
    const [rateToUSD, setRateToUSD] = useState<number>(0)

    /**
     * This function is called everytime a field gets focused.
     * If the current currency is not supported by the API,
     * it shows a message and dismiss the keyboard.
     */
    function handleInputFocus() {
        if (!currencyData.value || currencyData.value <= 0) {
            showToast('Sorry, currency not supported!', 'centre')
            setTimeout(() => Keyboard.dismiss(), 500)
        }
    }

    /**
     *
     * This function is called everytime that a field is changed.
     * It receives the new value typed, the functions to set both fields
     * and a flag to say if the field is the USD or the one to the current currency.
     * FIrstly it tests if the currency is supported or if the value is valid.
     * Then it calculates the other one using the rate value and set both fields.
     */
    function handleInputChange(value: string, setThis: Dispatch<SetStateAction<string>>, setOther: Dispatch<SetStateAction<string>>, isUSD: boolean = false) {

        if (!currencyData.value || currencyData.value <= 0) {
            showToast('Sorry, currency not supported!', 'centre')
            setThis('0.00')
            setOther('0.00')
            return
        }

        value = value.replace(/[^\d.]/g, '')

        if (!value || value === '') {
            setThis('0.00')
            setOther('0.00')
        } else
            //
            if (value[value.length - 1] === '.') {
                setThis(value)
            } else
                //
                if (value[value.length - 1] === '0' && value.includes('.')) {
                    setThis(value)
                }
                else {
                    const numberFormatted = parseFloat(value)
                    setThis(numberFormatted.toString())
                    setOther((numberFormatted * (isUSD ? 1 / rateToUSD : rateToUSD)).toFixed(2).toString())
                }

    }

    /**
     * This method is called once and gets the currency rate from the hook
     */
    useEffect(() => {
        if (!currencyData.value || currencyData.value <= 0)
            return
        //
        const numberFormatted = parseFloat(currencyData.value.toFixed(2).toString())
        setFirstValue('1.00')
        setSecondValue(numberFormatted.toString())
        setRateToUSD(numberFormatted)
        //
    }, [])

    /**
     * This method is called when the screen is focused and
     * checks if the currency is supported.
     */
    useEffect(() => {
        if (!isFocused)
            return
        //
        if (!currencyData.value || currencyData.value <= 0)
            showToast('Currency not supported!', 'centre')

    }, [isFocused])

    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/moneyIcon.png')}
                    style={Styles.logo}
                />
                <Text style={Styles.textLocation} >You are in {locationData.country} </Text>
                <Text style={Styles.text} >Your currency is {locationData.currency_name} ({locationData.currency_code})</Text>
                <Text style={Styles.text} >1.00 {locationData.currency_code} = {rateToUSD.toFixed(2)} USD </Text>
                <TextInput
                    style={Styles.input}
                    keyboardType='numeric'
                    value={firstValue}
                    onChangeText={props => handleInputChange(props, setFirstValue, setSecondValue)}
                    placeholder={'EUR'}
                    placeholderTextColor={'green'}
                    onFocus={() => handleInputFocus()}

                />
                <Text style={Styles.text} >Converting to USD</Text>
                <TextInput
                    style={Styles.input}
                    keyboardType='numeric'
                    value={secondValue}
                    onChangeText={props => handleInputChange(props, setSecondValue, setFirstValue, true)}
                    placeholder={'USD'}
                    placeholderTextColor={'blue'}
                    onFocus={() => handleInputFocus()}
                />

            </View>
        </>
    )
}

export default Currency
