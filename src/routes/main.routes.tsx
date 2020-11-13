import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather as Icon } from '@expo/vector-icons'


import Home from './../pages/Home'
import Location from './../pages/Location'
import Currency from './../pages/Currency'
import Camera from './../pages/Camera'
import Weather from './../pages/Weather'

interface TabBarIconProps {
    color: string
    size: number
}

const Tab = createBottomTabNavigator()

const locationOptions = {
    tabBarLabel: 'Location',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name='map-pin' color={color} size={size} />
    ),
}

const weatherOptions = {
    tabBarLabel: 'Weather',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name='cloud' color={color} size={size} />
    ),
}

const homeOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name='home' color={color} size={size} />
    ),
}

const currencyOptions = {
    tabBarLabel: 'Currency',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name='dollar-sign' color={color} size={size} />
    ),
}

const cameraOptions = {
    tabBarLabel: 'Camera',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name='camera' color={color} size={size} />
    ),
}

const MainRoute: React.FC = () => {

    //
    return (

        <NavigationContainer  >
            <Tab.Navigator
                initialRouteName={'Home'}
                tabBarOptions={{
                    activeTintColor: '#7a7a7a',
                    inactiveTintColor: '#C5C5C5',
                    //inactiveBackgroundColor: '#EBEEF2',
                    labelPosition: 'below-icon',
                }}
            >

                <Tab.Screen name='Location'
                    component={Location} options={locationOptions} />
                <Tab.Screen name='Weather'
                    component={Weather} options={weatherOptions} />
                <Tab.Screen name='Home'
                    component={Home} options={homeOptions} />
                <Tab.Screen name='Currency'
                    component={Currency} options={currencyOptions} />
                <Tab.Screen name='Camera'
                    component={Camera} options={cameraOptions} />

            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default MainRoute
