import React from 'react'
import { Text, View, Image } from 'react-native'

import Styles from './style'

const Home = () => {
    return (
        <>
            <View style={Styles.container} >
                <Image
                    source={require('../../../assets/logo.jpg')}
                    style={Styles.logo}
                />
                <Text>This prototype was developed by Cristian Menguer using React Native.</Text>
                <Text>The purpose of this project is apply all the acquired knowledge in class
                and further researches about the Mobile Development.</Text>
                <Text>Lecture: Mobile Development</Text>
                <Text>Lecturer: Amilcar Aponte</Text>
            </View>
        </>
    )
}

export default Home
