import React from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Home from './../pages/Home'

const Tab = createBottomTabNavigator()

const Tab1 = () => {return <Text>Tab 1</Text>}
const Tab3 = () => {return <Text>Tab 3</Text>}

const Routes = () => {
    return (
        <>
            <NavigationContainer >
                <Tab.Navigator initialRouteName="Home" >
                    <Tab.Screen name="Tab 1"
                        component={Tab1} />
                    <Tab.Screen name="Home"
                        component={Home}
                    />
                    <Tab.Screen name="Tab 3"
                        component={Tab3}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </>
    )
}

export default Routes
