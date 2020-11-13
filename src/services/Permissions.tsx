import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

export async function getLocationPermission() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    return status == 'granted'
}

export async function getStoragePermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
    return status == 'granted'
}

export async function getCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    return status == 'granted'
}
