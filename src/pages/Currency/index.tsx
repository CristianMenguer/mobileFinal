import React, { useState, useEffect } from 'react'
import { Text, View, Image, TextInput } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import useLocation from '../../hooks/location'
import useCurrency from '../../hooks/currency'
import { CURRENCY_TYPES } from '../../constants/Currency'

import Styles from './style'
import { GetGurrencyRates } from '../../services/CurrencyApi'

interface DataInterface {
    [key: string]: number
}

const Currency: React.FC = () => {

    const isFocused = useIsFocused()

    const { locationData } = useLocation()
    const { currencyData } = useCurrency()

    const [firstValue, setFirstValue] = useState('0')
    const [secondValue, setSecondValue] = useState('0')
    const [rateToUSD, setRateToUSD] = useState(0)

    function handleFirstValueChange(props: string) {
        let numberFormatted = 0
        let value = props
        //
        if (value === '') {
            setFirstValue('0')
        }
        else
            if (value[value.length - 1] === '.') {
                setFirstValue(value)
            }
            else {
                numberFormatted = parseFloat(value)
                setFirstValue(numberFormatted.toString())
                setSecondValue((numberFormatted * rateToUSD).toFixed(2).toString())
            }
    }

    function handleSecondValueChange(props: string) {
        let numberFormatted = 0
        let value = props
        //
        if (value === '') {
            setSecondValue('0')
        }
        else
            if (value[value.length - 1] === '.') {
                setSecondValue(value)
            }
            else {
                numberFormatted = parseFloat(value)
                setSecondValue(numberFormatted.toString())
                setFirstValue((numberFormatted * (1 / rateToUSD)).toFixed(2).toString())
            }
    }


    useEffect(() => {
        const temp = currencyData['USD']
        console.log(temp)
    }, [currencyData])

    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/moneyIcon.png')}
                    style={Styles.logo}
                />
                <Text >You are in Ireland </Text>
                <Text >Your currency is {locationData.currency_name} ({locationData.currency_code})</Text>
                <Text >1 {locationData.currency_code} = {currencyData[locationData.currency_code]} USD </Text>
                <TextInput
                    style={Styles.input}
                    keyboardType='numeric'
                    textContentType='creditCardNumber'
                    value={firstValue}
                    onChangeText={props => handleFirstValueChange(props)}
                    placeholder={'EUR'}
                    placeholderTextColor={'green'}

                />
                <Text >Converting to USD</Text>
                <TextInput
                    style={Styles.input}
                    keyboardType='numeric'
                    value={secondValue}
                    onChangeText={props => handleSecondValueChange(props)}
                    placeholder={'USD'}
                    placeholderTextColor={'blue'}
                />

            </View>
        </>
    )
}

export default Currency
