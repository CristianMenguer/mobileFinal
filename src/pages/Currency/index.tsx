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

    const { GetGeoData } = useLocation()
    const { SetCurrencyBase, GetCurrencyRate, GetRate, data } = useCurrency()

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

    async function setBase() {
        //await SetCurrencyBase(GetGeoData().currency_code)
        await SetCurrencyBase('BRL')

    }


    useEffect(() => {
        if (!isFocused)
            return
        //
        setBase()
        //
    }, [isFocused])

    useEffect(() => {
        const temp = GetRate('EUR')
        //console.log(temp)
        //setRateToUSD(GetCurrencyRate()['EUR'])
    }, [data])

    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/moneyIcon.png')}
                    style={Styles.logo}
                />
                <Text >You are in Ireland</Text>
                <Text >Your currency is {GetGeoData().currency_name} ({GetGeoData().currency_code})</Text>
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
