import * as Permissions from 'expo-permissions'

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
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    return status === 'granted'
}
