import React from 'react'

import { LocationProvider } from './location'
import { WeatherProvider } from './weather'
import { CurrencyProvider } from './currency'

const AppProvider: React.FC = ({ children }) => (
    <LocationProvider >
        <WeatherProvider >
            <CurrencyProvider >
                {children}
            </CurrencyProvider>
        </WeatherProvider>
    </LocationProvider>
)

export default AppProvider
