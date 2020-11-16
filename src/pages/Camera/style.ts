import { StyleSheet, Dimensions } from 'react-native'

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F4',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    cityText: {
        fontSize: 24,
        fontWeight: '700',
        marginVertical: 24,
        textAlign: 'center',
        maxWidth: '85%',
    },
    hasPhoto: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo: {
        borderRadius: 16,
        width: '95%',
        height: ((Dimensions.get('window').width * 0.95) / 2) * 1,
    },
    hasPhotoText: {
        marginVertical: 24,
        fontSize: 16,
        textAlign: 'center',
        maxWidth: '70%',
    },
    confirmText: {
        marginVertical: 4,
        fontSize: 16,
        textAlign: 'center',
        maxWidth: '70%',
    },
    button: {
        marginTop: 8,
        height: 100,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },

})

export default Styles
