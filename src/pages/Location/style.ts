import React from 'react'
import { StyleSheet } from 'react-native'

// This is the style file to the location page

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#F3F4F4',
        marginVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    mapContainer: {
        flex: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 4,
        width: '96%',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    itemsContainer: {
        width: '98%',
        height: 200,
        borderRadius: 8,
        justifyContent: 'center',
        backgroundColor: '#ddd',
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
        height: 150,
        width: 150,
    },
    addButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    addText: {
        color: '#505050',
        textAlign: 'center'
    },
    itemTitle: {
        marginLeft: 12,
        marginBottom: 8,
        marginTop: 8,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 1,
        color: '#505050',
    },
    itemTitleObs: {
        marginTop: -4,
        fontSize: 8,
        fontWeight: '300',

    },
    itemText: {
        fontSize: 18,
        justifyContent: 'center',
        textAlign: 'center'

    },
    itemFlag: {
        fontSize: 32,

    },
    itemIcon: {
        height: 80,
        width: 80,
    },
    descriptionText: {
        fontSize: 16,
    },
    mapMarker: {
        width: 90,
        height: 80,
    },
    mapMarkerContainer: {
        width: 90,
        height: 70,
        flexDirection: 'column',
        borderRadius: 8,
        overflow: 'hidden',
        alignItems: 'center'
    },
    mapMarkerImage: {
        width: 90,
        height: 45,
        resizeMode: 'cover',
    },

    mapMarkerTitle: {
        flex: 1,
        color: '#000',
        fontSize: 13,
        lineHeight: 23,
    },

})

export default Styles
