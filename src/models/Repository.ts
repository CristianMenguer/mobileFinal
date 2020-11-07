import { execSql, selectDB } from '../database'

export const AddRepository = async (props: Repository): Promise<boolean> => {
    if (!props || !props.description || !props.full_name || !props.owner.avatar_url || !props.owner.login)
        return false
    //
    const sql = `insert into repository (description, full_name, avatar_url, login) values ('${props.description}', '${props.full_name}', '${props.owner.avatar_url}', '${props.owner.login}')`

    const response = await execSql(sql)

    return response

}

export const DeleteRepository = async (id: number): Promise<boolean> => {
    if (id < 1)
        return false
    //
    const sql = `delete from repository where id = ${id}`

    const response = await execSql(sql)

    return response

}

export const LoadRepository = async (): Promise<Repository[]> => {

    const tableName = 'repository'

    const response = await selectDB(tableName) as RepositoryResponse[]

    const repos: Repository[] = []

    response.map(obj => {
        const repo: Repository = {
            id: obj.id,
            description: obj.description,
            full_name: obj.full_name,
            owner: {
                avatar_url: obj.avatar_url,
                login: obj.login
            }
        }
        repos.push(repo)
    })

    return repos

}

