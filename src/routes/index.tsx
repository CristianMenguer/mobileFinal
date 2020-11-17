import React, { useRef, useEffect } from 'react'
import { NavigationContainerRef } from '@react-navigation/native'

import useAllData from './../hooks/allData'

import LoadingRoute from './loading.routes'
import MainRoute from './main.routes'

/**  This component checks if the app is loading.
 * If it is, calls the Loading component.
 * If it is not, calls the Main component.
*/

const Routes: React.FC = () => {

    const { isLoading } = useAllData()
    //
    if (isLoading)
        return <LoadingRoute />
    //
    return <MainRoute />
}

export default Routes
