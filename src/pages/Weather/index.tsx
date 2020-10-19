import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { FontAwesome5 as Icon } from '@expo/vector-icons'

import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'

import Styles from './style'
import Loader from '../../components/Loader'

const Weather: React.FC = () => {

    const { locationData } = useLocation()
    const { weatherData, forecastDaily, forecastHourly } = useWeather()
    const [currentDate, setCurrentDate] = useState('')

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString())
        console.log(forecastDaily)
    }, [])

    if (currentDate === '')
        return <Loader message='Loading Weather Information' />
    //
    return (
        <>
            <ScrollView >
                <View style={Styles.container} >
                    <View style={Styles.location} >
                        <Icon name='map-marker-alt' size={20} />
                        <Text style={Styles.locationText} >  {locationData.city ? locationData.city : locationData.county}</Text>
                    </View>
                    <Text style={Styles.dateText} >{currentDate}</Text>
                    <View style={Styles.currentTemp} >
                        <Image style={Styles.currentTempIcon} source={{ uri: weatherData.iconUri }} />
                        <Text style={Styles.currentTempText} >{weatherData.temperature}℃</Text>
                    </View>
                    <Text style={Styles.feelLikeText} >{weatherData.temp_min}℃ / {weatherData.temp_max}℃ Feels like {weatherData.feel_like}℃</Text>
                    <Text style={Styles.descriptionText} >{weatherData.description}</Text>

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
