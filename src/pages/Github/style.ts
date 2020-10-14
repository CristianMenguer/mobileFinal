import { StyleSheet } from 'react-native'

const Styles = StyleSheet.create({
    container: {
        marginTop: 24,
        backgroundColor: '#F3F4F4',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    logo: {
        height: 150,
        width: 150,
    },
    input: {
        width: 350,
        maxWidth: '90%',
        height: 60,
        borderRadius: 5,
        borderWidth: 2,
        backgroundColor: '#FFF',
        borderColor: '#232129',
        color: 'black',
        fontSize: 16,
        marginVertical: 16,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
    button: {
        width: 210,
        height: 60,
        backgroundColor: '#04D361',
        borderRadius: 5,
        borderWidth: 0,
        color: '#FFF',
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
    },
    repositories: {
        flex: 1,
        marginTop: 16,
        marginBottom: 4,
        paddingHorizontal: 4,
    },
    repoImg: {
        height: 64,
        width: 64,
        borderRadius: 50,
    },
    repo: {
        backgroundColor: '#fff',
        borderWidth: 5,
        borderColor: '#ccc',
        borderRadius: 10,
        width: '100%',
        padding: 16,
        marginTop: 4,
        alignItems: 'center',
    },
    repoTexts: {
        margin: 16,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    repoName: {
        fontSize: 20,
        color: '#3D3D4D',
        textAlign: 'center',
    },
    repoDescription: {
        fontSize: 18,
        color: '#A8A8B3',
        marginTop: 4,
        textAlign: 'center',
    },
    textError: {
    color: '#c53030',
    marginTop: 8,
    }
})

export default Styles
