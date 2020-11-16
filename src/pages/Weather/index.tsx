import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import { FontAwesome5 as Icon } from '@expo/vector-icons'

import useLocation from '../../hooks/location'
import useWeather from '../../hooks/weather'

import Styles from './style'
import Loader from '../../components/Loader'
import { useIsFocused } from '@react-navigation/native'

const Weather: React.FC = () => {

    const { locationData } = useLocation()
    const { weatherData, forecastDaily, forecastHourly } = useWeather()

    const [currentDate, setCurrentDate] = useState('')
    const [location, setLocation] = useState('')

    useEffect(() => setCurrentDate(new Date().toLocaleDateString()), [])

    useEffect(() => {
        weatherData.temp_min = forecastDaily[0].min_temp
        weatherData.temp_max = forecastDaily[0].max_temp
        //
        if (locationData?.country)
            setLocation(`${locationData.city ? locationData.city : locationData.county}, ${locationData.country} ${locationData.flag}`)
        else if (locationData?.formatted)
            setLocation(locationData.formatted)
        else
            setLocation('Location not found!')
    }, [])

    if (currentDate === '' ||
        //forecastHourly.length < 1 ||
        forecastDaily.length < 1)
        return <Loader message='Loading Weather Information' />
    //
    return (
        <>
            <ScrollView >
                <View style={Styles.container} >
                    <View style={Styles.location} >
                        <Icon name='map-marker-alt' size={20} />
                        <Text style={Styles.locationText} >  {location}</Text>
                    </View>
                    <Text style={Styles.dateText} >{currentDate}</Text>
                    <View style={Styles.currentTemp} >
                        <Image style={Styles.currentTempIcon} source={{ uri: weatherData.iconUri }} />
                        <Text style={Styles.currentTempText} >{weatherData.temperature.toFixed(1)}℃</Text>
                    </View>
                    <Text style={Styles.feelLikeText} >{weatherData.temp_min.toFixed(1)}℃ / {weatherData.temp_max.toFixed(1)}℃ Feels like {weatherData.feel_like.toFixed(1)}℃</Text>
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
                                        <Text style={Styles.itemPercText} > {item.pop.toFixed(0)}%</Text>
                                    </View>
                                    <Text style={Styles.descriptionText} >{item.temp.toFixed(1)}℃</Text>
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
                                        <Text style={Styles.itemPercText} > {item.pop.toFixed(0)}%</Text>
                                    </View>
                                    <Text style={Styles.descriptionText} >{item.min_temp.toFixed(0)}℃ / {item.max_temp.toFixed(0)}℃</Text>
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
