import React, { useState, useRef, useEffect } from 'react'
import { View } from 'react-native'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather as Icon, AntDesign } from '@expo/vector-icons'

import useAllData from './../hooks/allData'

import Home from './../pages/Home'
import Location from './../pages/Location'
import Currency from './../pages/Currency'
import Github from './../pages/Github'
import Weather from './../pages/Weather'
import Loading from './../pages/Loading'

interface TabBarIconProps {
    color: string
    size: number
}

const Tab = createBottomTabNavigator()

const locationOptions = {
    tabBarLabel: 'Location',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name="map-pin" color={color} size={size} ></Icon>
    ),
}

const weatherOptions = {
    tabBarLabel: 'Weather',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name="cloud" color={color} size={size} ></Icon>
    ),
}

const homeOptions = {
    tabBarLabel: 'Home',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name="home" color={color} size={size} ></Icon>
    ),
}

const currencyOptions = {
    tabBarLabel: 'Currency',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name="dollar-sign" color={color} size={size} ></Icon>
    ),
}

const githubOptions = {
    tabBarLabel: 'Github',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <AntDesign name="github" color={color} size={size} ></AntDesign>
    ),
}

const loadingOptions = {
    tabBarVisible: false,
    tabBarLabel: 'Loading',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name="download" color={color} size={size} ></Icon>
    ),
}

const Routes: React.FC = () => {

    const navigationRef = useRef<NavigationContainerRef>(null)

    const { isLoading } = useAllData()

    useEffect(() => {
        // console.log('isLoading: ' + isLoading)
        if (!isLoading && navigationRef)
            navigationRef?.current?.navigate('Home')
        //
    }, [isLoading, navigationRef])

    //
    return (

        <NavigationContainer ref={navigationRef} >
            <Tab.Navigator
                initialRouteName={'Loading'}
                tabBarOptions={{
                    activeTintColor: '#7a7a7a',
                    inactiveTintColor: '#C5C5C5',
                    //inactiveBackgroundColor: '#EBEEF2',
                    labelPosition: 'below-icon',
                }}
            >

                <Tab.Screen name="Location"
                    component={Location} options={locationOptions} />
                <Tab.Screen name="Weather"
                    component={Weather} options={weatherOptions} />
                <Tab.Screen name="Home"
                    component={Home} options={homeOptions} />
                <Tab.Screen name="Currency"
                    component={Currency} options={currencyOptions} />
                <Tab.Screen name="Github"
                    component={Github} options={githubOptions} />

                {isLoading &&
                    <Tab.Screen name="Loading"
                        component={Loading} options={loadingOptions} />
                }

            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Routes
