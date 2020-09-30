import * as Permissions from 'expo-permissions'

export async function getLocationPermission() {
    const { status } = await Permissions.askAsync(Permissions.LOCATION)
    return status == 'granted'
}
