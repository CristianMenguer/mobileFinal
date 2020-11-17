import React, { useRef } from 'react'
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather as Icon } from '@expo/vector-icons'

import Loading from './../pages/Loading'

/**
 * This component will exclusively call the Loading page.
 * The menu will not appear and the user will have to wait until
 * all information is loaded.
 */

interface TabBarIconProps {
    color: string
    size: number
}

const Tab = createBottomTabNavigator()

const loadingOptions = {
    tabBarVisible: false,
    tabBarLabel: 'Loading',
    tabBarIcon: ({ color, size }: TabBarIconProps) => (
        <Icon name="download" color={color} size={size} ></Icon>
    ),
}

const LoadingRoute: React.FC = () => {

    const navigationRef = useRef<NavigationContainerRef>(null)

    //
    return (

        <NavigationContainer ref={navigationRef} >
            <Tab.Navigator
                initialRouteName={'Loading'}
                tabBarOptions={{
                    activeTintColor: '#7a7a7a',
                    inactiveTintColor: '#C5C5C5',
                    labelPosition: 'below-icon',
                }}
            >

                    <Tab.Screen name="Loading"
                        component={Loading} options={loadingOptions} />

            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default LoadingRoute
