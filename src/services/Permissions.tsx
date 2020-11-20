import * as Permissions from 'expo-permissions'
import { showToast } from './ShowToast'

/**
 * In this file all the permissions that are necessary to the app are asked/checked
*/

// Location permission
export async function getLocationPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    return status === 'granted'
}

// Camera permission
export async function getCameraPermission(): Promise<boolean> {
    const response = await Permissions.askAsync(Permissions.CAMERA)
    showToast(JSON.stringify(response), 'centre', 'long')
    const { status, granted } = response
    // if (status !== 'granted') {
    //     showToast(`Hey! The app needs camera permission! (${status})`, 'top')
    //     showToast(granted ? 'granted' : 'not granted', 'bottom')
    // }
    return status === 'granted'
}
