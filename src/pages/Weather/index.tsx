import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { FontAwesome5 as Icon } from '@expo/vector-icons'

import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'

import Styles from './style'

interface Forecast {
    id: number
    valid_date: string
    temp: number
    min_temp: number
    max_temp: number
    min_feel_like: number
    max_feel_like: number
    pop: number
    description: string
    iconCode: string
    iconUri: string
}

const Weather: React.FC = () => {

    const { GetGeoData } = useLocation()
    const { getWeatherData, getDailyData, getHourlyData } = useWeather()
    const [currentDate, setCurrentDate] = useState('')
    const [forecastDaily, setForecastDaily] = useState<Forecast[]>(getDailyData())
    const [forecastHourly, setForecastHourly] = useState<Forecast[]>(getHourlyData())

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString())
    }, [])

    useEffect(() => {
        setForecastDaily(getDailyData())
        setForecastHourly(getHourlyData())
    }, [getDailyData(), getHourlyData()])

    return (
        <>
            <ScrollView >
                <View style={Styles.container} >
                    <View style={Styles.location} >
                        <Icon name='map-marker-alt' size={20} />
                        <Text style={Styles.locationText} >  {GetGeoData().city ? GetGeoData().city : GetGeoData().county}</Text>
                    </View>
                    <Text style={Styles.dateText} >{currentDate}</Text>
                    <View style={Styles.currentTemp} >
                        <Image style={Styles.currentTempIcon} source={{ uri: getWeatherData().iconUri }} />
                        <Text style={Styles.currentTempText} >{getWeatherData().temperature}℃</Text>
                    </View>
                    <Text style={Styles.feelLikeText} >{getWeatherData().temp_min}℃ / {getWeatherData().temp_max}℃ Feels like {getWeatherData().feel_like}℃</Text>
                    <Text style={Styles.descriptionText} >{getWeatherData().description}</Text>

                </View>

                <View style={Styles.itemsContainer} >
                    <Text style={Styles.itemTitle} >Hourly</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {
                            forecastHourly.map(item => (
                                <View key={item.id} style={Styles.item}  >
                                    <Text style={Styles.itemText} >{item.valid_date}</Text>
                                    <Image source={{ uri: item.iconUri }} style={Styles.itemIcon} />
                                    <View style={Styles.itemPerc} >
                                        <Icon name='cloud-rain' size={18} />
                                        <Text style={Styles.itemPercText} > {item.pop}%</Text>
                                    </View>
                                    <Text style={Styles.descriptionText} >{item.temp}℃</Text>
                                </View>
                            ))
                        }

                    </ScrollView>
                </View>

                <View style={Styles.itemsContainer} >
                    <Text style={Styles.itemTitle} >Daily</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {
                            forecastDaily.map(item => (
                                <View key={item.id} style={Styles.item} >
                                    <Text style={Styles.itemText} >{item.valid_date}</Text>
                                    <Image source={{ uri: item.iconUri }} style={Styles.itemIcon} />
                                    <View style={Styles.itemPerc} >
                                        <Icon name='cloud-rain' size={18} />
                                        <Text style={Styles.itemPercText} > {item.pop}%</Text>
                                    </View>
                                    <Text style={Styles.descriptionText} >{item.min_temp}℃ / {item.max_temp}℃</Text>
                                </View>
                            ))
                        }

                    </ScrollView>
                </View>
            </ScrollView>
        </>
    )
}

export default Weather
