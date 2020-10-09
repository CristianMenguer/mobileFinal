import AsyncStorage from '@react-native-community/async-storage'

interface SetInfoProps {
    key: string
    value: string
}

const appKey = '@2020087'

export const SetInfo = async (props: SetInfoProps) => {
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
