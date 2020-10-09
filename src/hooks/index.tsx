import React from 'react'

import { LocationProvider } from './location'
import { WeatherProvider } from './weather'

const AppProvider: React.FC = ({ children }) => (
    <LocationProvider >
        <WeatherProvider >
            {children}
        </WeatherProvider>
    </LocationProvider>
)

export default AppProvider
