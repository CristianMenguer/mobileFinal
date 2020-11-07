import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View, Image, ScrollView, Alert, Keyboard } from 'react-native'

//import { GetInfo, SetInfo } from '../../services/InfoStorage'
import GithubApi from '../../services/GithubApi'

import Styles from './style'
import { AddRepository, LoadRepository } from '../../models/Repository'
import { useIsFocused } from '@react-navigation/native'

const Github: React.FC = () => {

    const isFocused = useIsFocused()

    const [repoTyped, setRepoTyped] = useState('')
    const [inputError, setInputError] = useState('')
    const [repositories, setRepositories] = useState<Repository[]>([])

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

                setRepositories([...repositories, repository])
                setInputError('')

                AddRepository(repository)
            }
        } catch (err) {
            setInputError(`Repository "${repoTyped}" not found!`)
        }
        //
        setRepoTyped('')
    }

    function handleDeleteRepository(repo_name: string) {
        if (!repo_name)
            return
        //
        Alert.alert(
            'Delete Repository',
            `Are you sure you want to delete ${repo_name}?`,
            [
                {
                    text: 'No',
                    onPress: () => console.log('No')
                },
                {
                    text: 'Yes',
                    onPress: () => setRepositories(repositories.filter(repo => repo.full_name !== repo_name))
                }
            ],
            { cancelable: false }
        )
    }

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
                                onLongPress={() => handleDeleteRepository(repo.full_name)}
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
