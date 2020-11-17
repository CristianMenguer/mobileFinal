import { selectDB, insertDB } from '../database'

const tableName = 'weather'

// This function receives a Weather Id and retrieves the Weather object
// from the database and returns it.
export const LoadWeatherDB = async (idCoord: number): Promise<Weather> => {

    const response = await selectDB(tableName, `coordId = ${idCoord}`) as Weather[]

    if (response.length == 0 || response.length > 1)
        return {} as Weather
    //
    return response[0]

}

// This function receives a Weather object and saves it to the database and returns the object saved
// with the new ID.
export const AddWeatherDB = async (props: Weather): Promise<Weather> => {
    if (!props || (props.id && props.id > 0))
        return props
    //
    const sql = `insert into ${tableName} (` +
        'coordId, temperature, temp_min, temp_max, feel_like, description, iconCode, iconUri, timeAPI ' +
        ') values (' +
        ` ${props.coords?.id}, ${props.temperature}, ${props.temp_min}, ${props.temp_max}, ` +
        ` ${props.feel_like}, '${props.description}', '${props.iconCode}', '${props.iconUri}', ` +
        ` ${props.timeAPI} )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}
