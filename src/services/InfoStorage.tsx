import AsyncStorage from '@react-native-community/async-storage'

const appKey = '@2020087'

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

export const GetInfo = async (key: string) => {
    const response = await AsyncStorage.getItem(`${appKey}:${key}`)
    //
    if (!!response)
        return response
    //
    return null
}

export const DeleteInfo = async (key: string) => {
    //
    try {
        await AsyncStorage.removeItem(`${appKey}:${key}`)
    } catch (e) {
        console.log('Error deleteInfo: ' + e)
    }
}
