import React from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from './../pages/Home'
import Location from './../pages/Location'

const Tab = createBottomTabNavigator()

const Routes = () => {
    return (
        <>
            <NavigationContainer >
                <Tab.Navigator initialRouteName="Location" >
                    <Tab.Screen name="Location"
                        component={Location} />
                    <Tab.Screen name="Home"
                        component={Home}
                    />
                    <Tab.Screen name="Tab 3"
                        component={Home}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </>
    )
}

export default Routes
