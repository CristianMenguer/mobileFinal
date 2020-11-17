import React from 'react'

import { LocationProvider } from './location'
import { WeatherProvider } from './weather'
import { CurrencyProvider } from './currency'
import { AllDataProvider } from './allData'

// This class is the most important for the hooks, because it wraps all the hooks
// in the app

const AppProvider: React.FC = ({ children }) => (
    <LocationProvider >
        <WeatherProvider >
            <CurrencyProvider >
                <AllDataProvider >
                    {children}
                </AllDataProvider>
            </CurrencyProvider>
        </WeatherProvider>
    </LocationProvider>
)

export default AppProvider
