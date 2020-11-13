import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, ScrollView, Alert, Keyboard } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useIsFocused } from '@react-navigation/native'
import { MaterialIcons as Icon } from '@expo/vector-icons'

import Styles from './style'
import useLocation from '../../hooks/location'
import Toast from 'react-native-tiny-toast'
import { UpdateGeoLocationPhotoDB } from '../../models/Location'

const Camera: React.FC = () => {

    const isFocused = useIsFocused()

    const { locationData } = useLocation()

    const [photoPath, setPhotoPath] = useState('')

    useEffect(() => {
        if (!isFocused)
            return
        //
    }, [isFocused])

    async function handleTakePicture() {
        //
        const cameraResponse = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            allowsMultipleSelection: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })

        if (cameraResponse.cancelled)
            return
        //
        setPhotoPath(cameraResponse.uri)
        //setTimeout(() => { setPhotoPath('') }, 3000)
        //
    }

    async function handleConfirmPicture() {
        UpdateGeoLocationPhotoDB(photoPath, locationData.id ? locationData.id : 0)
        locationData.image_uri = photoPath
    }

    return (
        <>
            <View style={Styles.container} >
                <Text >{locationData.city}</Text>
                <Image
                    source={
                        photoPath && photoPath !== '' ?
                            { uri: photoPath }
                            :
                            require('../../../assets/location.jpg')
                    }
                    style={{ width: 400, height: 300 }}

                />

                {/* <Image
                    source={
                        locationData.image_uri && locationData.image_uri !== '' ?
                            { uri: locationData.image_uri }
                            :
                            require('../../../assets/location.jpg')
                    }

                /> */}
                <TouchableOpacity onPress={handleTakePicture} style={{ height: 100, width: 100, }} >
                    <Icon name='add-a-photo' size={64} color={'#505050'} />
                    <Text >Take Picture</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleConfirmPicture} style={{ height: 100, width: 100, }} >
                    <Icon name='backup' size={64} color={'#505050'} />
                    <Text >Confirm Picture</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default Camera
