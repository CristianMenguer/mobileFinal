import axios from 'axios'

const baseURL = 'https://api.github.com/repos'

const GithubApi = axios.create({
    baseURL
})

export default GithubApi
