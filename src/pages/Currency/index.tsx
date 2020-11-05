import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Text, View, Image, TextInput } from 'react-native'
import { useIsFocused } from '@react-navigation/native'

import useLocation from '../../hooks/location'
import useCurrency from '../../hooks/currency'
import { CURRENCY_TYPES } from '../../constants/Currency'

import Styles from './style'

interface DataInterface {
    [key: string]: number
}

const Currency: React.FC = () => {

    const isFocused = useIsFocused()

    const { locationData } = useLocation()
    const { currencyData } = useCurrency()

    const [firstValue, setFirstValue] = useState('0')
    const [secondValue, setSecondValue] = useState('0')
    const [rateToUSD, setRateToUSD] = useState<number>(0)

    function handleInputChange(value: string, setThis: Dispatch<SetStateAction<string>>, setOther: Dispatch<SetStateAction<string>>, isUSD: boolean = false) {

        value = value.replace(/[^\d.-]/g, '')

        if (!value || value === '') {
            setThis('0')
            setOther('0')
        } else
            //
            if (value[value.length - 1] === '.') {
                setThis(value)
            } else
            //
            if (value[value.length - 1] === '0' && value.includes('.')) {
                setThis(value)
            }
            else
            {
                const numberFormatted = parseFloat(value)
                setThis(numberFormatted.toString())
                setOther((numberFormatted * (isUSD ? 1 / rateToUSD : rateToUSD)).toFixed(2).toString())
            }

    }

    useEffect(() => {
        const numberFormatted = parseFloat(currencyData['USD'].toFixed(2).toString())
        setFirstValue('1.00')
        setSecondValue(numberFormatted.toString())
        setRateToUSD(numberFormatted)
        //
    }, [])

    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/moneyIcon.png')}
                    style={Styles.logo}
                />
                <Text style={Styles.textLocation} >You are in Ireland </Text>
                <Text style={Styles.text} >Your currency is {locationData.currency_name} ({locationData.currency_code})</Text>
                <Text style={Styles.text} >1 {locationData.currency_code} = {rateToUSD} USD </Text>
                <TextInput
                    style={Styles.input}
                    keyboardType='numeric'
                    value={firstValue}
                    onChangeText={props => handleInputChange(props, setFirstValue, setSecondValue)}
                    placeholder={'EUR'}
                    placeholderTextColor={'green'}

                />
                <Text style={Styles.text} >Converting to USD</Text>
                <TextInput
                    style={Styles.input}
                    keyboardType='numeric'
                    value={secondValue}
                    onChangeText={props => handleInputChange(props, setSecondValue, setFirstValue, true)}
                    placeholder={'USD'}
                    placeholderTextColor={'blue'}
                />

            </View>
        </>
    )
}

export default Currency
