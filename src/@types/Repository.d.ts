interface Repository {
    id?: number
    full_name: string
    description: string
    owner: {
        login: string
        avatar_url: string
    }
}
