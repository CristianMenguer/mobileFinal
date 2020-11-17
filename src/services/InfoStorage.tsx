import AsyncStorage from '@react-native-community/async-storage'

const appKey = '@2020087'

/**
 * This file is used to Set and Get info to/from the Local Storage of the device
 * using a specific key to the app
 */

// This function sets a value to a specific key
export const SetInfo = async (props: SetInfoProps) => {
    if (!props.key || !props.value)
        return
    //
    try {
        await AsyncStorage.setItem(`${appKey}:${props.key}`, props.value)
    } catch (e) {
        console.log('Error setInfo: ' + e)
    }
}

// This function returns a value from a specific key
export const GetInfo = async (key: string) => {
    if (!key || key === '')
        return
    //
    const response = await AsyncStorage.getItem(`${appKey}:${key}`)
    //
    if (!!response)
        return response
    //
    return null
}

// This function deletes a value from a specific key
export const DeleteInfo = async (key: string) => {
    if (!key || key === '')
        return
    //

    try {
        await AsyncStorage.removeItem(`${appKey}:${key}`)
    } catch (e) {
        console.log('Error deleteInfo: ' + e)
    }
}
