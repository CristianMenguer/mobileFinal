import * as Permissions from 'expo-permissions'
import { Camera } from 'expo-camera'

export async function getLocationPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    return status === 'granted'
}

export async function getCameraPermission(): Promise<boolean> {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    return status === 'granted'
}
