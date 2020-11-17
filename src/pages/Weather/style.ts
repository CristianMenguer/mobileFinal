import { StyleSheet } from 'react-native'

// This is the style file to the weather page

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F4',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        height: 350,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 28,
    },
    dateText: {
        fontSize: 20
    },
    currentTemp: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currentTempIcon: {
        width: 160,
        height: 160,
    },
    currentTempText: {
        fontSize: 32,
        marginHorizontal: 16,
    },
    feelLikeText: {
        fontSize: 16,
        marginVertical: 8,
    },
    descriptionText: {
        fontSize: 16,
    },
    itemsContainer: {
        flexDirection: 'column',
        marginTop: 16,
        marginBottom: 32,
    },
    item: {
        borderWidth: 2,
        backgroundColor: '#FFF',
        borderColor: '#EEE',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 16,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 190,
        width: 160,
    },
    itemTitle: {
        marginLeft: 16,
        marginBottom: 16,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 1,
    },
    itemText: {
        fontSize: 20,
    },
    itemIcon: {
        height: 80,
        width: 80,
    },
    itemPerc: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemPercText: {
        fontSize: 16,
        marginLeft: 4,
    },
})

export default Styles
