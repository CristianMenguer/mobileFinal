import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, ScrollView, Alert, Keyboard } from 'react-native'

//import { GetInfo, SetInfo } from '../../services/InfoStorage'
import GithubApi from '../../services/GithubApi'

import Styles from './style'
import { AddRepository, DeleteRepository, LoadRepository } from '../../models/Repository'
import { useIsFocused } from '@react-navigation/native'
import Toast from 'react-native-tiny-toast'

const Github: React.FC = () => {

    const isFocused = useIsFocused()

    const [repoTyped, setRepoTyped] = useState('')
    const [inputError, setInputError] = useState('')
    const [repositories, setRepositories] = useState<Repository[]>([])

    useEffect(() => {
        if (!isFocused)
            return
        //
        LoadRepository()
            .then(response => {
                if (!!response)
                    setRepositories(response)
                //
            })
        //
    }, [isFocused])

    async function handleAddRepository() {
        Keyboard.dismiss()

        if (!repoTyped) {
            setInputError('Please type author/repository name in order to add!')
            return
        }

        try {
            const response = await GithubApi.get<Repository>(repoTyped)

            if (!!response) {

                const repository = response.data

                const responseAdd = await AddRepository(repository)

                if (responseAdd) {
                    setRepositories([...repositories, repository])
                    setInputError('')
                    Toast.showSuccess(`Repository ${repository.full_name} added!`, {
                        position: Toast.position.BOTTOM
                    })
                } else {
                    setInputError('Error trying to add. Please try again!')
                }

            }
        } catch (err) {
            setInputError(`Repository "${repoTyped}" not found!`)
        }
        //
        setRepoTyped('')
    }

    function handleDeleteRepository(props: Repository) {
        if (!props || !props.id) {
            setInputError('Error trying to delete! Plaese try again!')
            return
        }
        //
        Alert.alert(
            'Delete Repository',
            `Are you sure you want to delete ${props.full_name}?`,
            [
                {
                    text: 'No',
                    onPress: () => console.log('No')
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        // @ts-ignore
                        if (await DeleteRepository(props.id)) {
                            setRepositories(repositories.filter(repo => repo.id !== props.id))
                            Toast.showSuccess(`Repository ${props.full_name} deleted!`, {
                                position: Toast.position.BOTTOM
                            })
                        } else {
                            setInputError('Error trying to delete! Plaese try again!')
                        }
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <>
            <View style={Styles.container} >
                <Image
                    style={Styles.logo}
                    source={{
                        uri: 'https://cdn3.iconfinder.com/data/icons/free-social-icons/67/github_circle_black-512.png'
                    }}
                />

                <TextInput
                    style={Styles.input}
                    value={repoTyped}
                    onChangeText={value => setRepoTyped(value)}
                    placeholder='Username/Repository'
                />
                <TouchableOpacity
                    style={Styles.button}
                    onPress={handleAddRepository}
                >
                    <Text >Search</Text>
                </TouchableOpacity>

                {!!inputError && <Text style={Styles.textError} >{inputError}</Text>}

                <ScrollView
                    style={Styles.repositories}
                    showsHorizontalScrollIndicator={false}
                >
                    {
                        !!repositories && repositories.map(repo => (
                            <TouchableOpacity
                                key={repo.full_name}
                                style={Styles.repo}
                                delayLongPress={750}
                                onLongPress={() => handleDeleteRepository(repo)}
                            >
                                <Image
                                    source={{
                                        uri: repo.owner.avatar_url
                                    }}
                                    style={Styles.repoImg}
                                />
                                <View style={Styles.repoTexts} >
                                    <Text style={Styles.repoName} >{repo.full_name}</Text>
                                    <Text style={Styles.repoDescription} >{repo.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                </ScrollView>

            </View>
        </>
    )
}

export default Github
