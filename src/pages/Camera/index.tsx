import React, { useState } from 'react'
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Updates from 'expo-updates'
import { MaterialIcons as Icon } from '@expo/vector-icons'

import Styles from './style'
import useLocation from '../../hooks/location'
import { UpdateGeoLocationPhotoDB } from '../../models/Location'
import { showToast } from '../../services/ShowToast'
import { sleep } from '../../services/Sleep'

// This interface is used to set the images url/path
interface Source {
    uri: string
}

const Camera: React.FC = () => {

    // Get locationData from the hook
    const { locationData } = useLocation()

    // variable to store the image shown on screen
    const [source, setSource] = useState<Source>(() => {
        const uri = locationData.image_uri && locationData.image_uri !== '' ?
            { uri: locationData.image_uri }
            :
            require('../../../assets/location.jpg')
        //
        return uri
    })

    /**
     * This function  is called when the button to take a picture is touched.
     * Firstly it calls ImagePicker.launchCameraAsync to open the device camera.
     * If a picture was taken, it is shown on screen and a confirmation dialog is
     * also shown on screen asking if the user wants to save the picture and reload
     * the app to apply the change. If 'Yes' is selected, it will save the new picture
     * to current location in the database and the app will be reloaded.
     */
    async function handleTakePicture() {
        const cameraResponse = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            allowsMultipleSelection: false,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [2, 1]
        })

        if (cameraResponse.cancelled)
            return
        //
        const newPhoto = cameraResponse.uri
        locationData.image_uri = newPhoto
        setSource({ uri: newPhoto })
        await sleep(500)
        //
        Alert.alert(
            'Confirm new Picture',
            'Would you like to save the new picture and reload the app?',
            [
                {
                    text: 'No',
                    onPress: () => console.log('No')
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        await UpdateGeoLocationPhotoDB(newPhoto, locationData.id ? locationData.id : 0)
                        showToast('New picture saved. The app is reloading!')
                        setTimeout(() => Updates.reloadAsync(), 1000)
                    }
                }
            ],
            { cancelable: false }
        )

        //
    }


    return (
        <>
            <View style={Styles.container} >
                <Text style={Styles.cityText} >Saving a picture to {locationData.city} {locationData.flag ? locationData.flag : ' '}</Text>
                <View style={Styles.hasPhoto} >
                    <Text style={Styles.hasPhotoText} >The picture below is saved to this location.</Text>
                    <Image
                        source={source}
                        style={Styles.photo}

                    />
                    <Text style={Styles.hasPhotoText} >Touch the camera icon below to replace it.</Text>

                    <TouchableOpacity onPress={handleTakePicture} style={Styles.button} >
                        <Icon name='add-a-photo' size={64} color={'#505050'} />
                        <Text >Take Picture</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default Camera
