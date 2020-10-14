import React from 'react'

import { LocationProvider } from './location'
import { WeatherProvider } from './weather'
import { CurrencyProvider } from './currency'
import { AllDataProvider } from './allData'

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
