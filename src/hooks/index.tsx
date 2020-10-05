import React from 'react'

import { LocationProvider } from './location'

const AppProvider: React.FC = ({ children }) => (
    <LocationProvider >
            {children}
    </LocationProvider>
)

export default AppProvider
