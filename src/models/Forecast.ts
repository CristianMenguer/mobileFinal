import { selectDB, insertDB } from '../database'

const tableName = 'forecast'

// This function receives the weather id and the type, and retrieves the forecast objects
// from the database and returns them.
export const LoadForecastDB = async (idWeather: number, type: string): Promise<Forecast[]> => {

    const response = await selectDB(tableName, `weatherId = ${idWeather} and type = '${type}'`) as Forecast[]

    if (response.length == 0)
        return []
    //
    return response

}

// This function receives a forecast object and saves it to the database and returns the object saved
// with the new ID.
export const AddForecastDB = async (props: Forecast): Promise<Forecast> => {
    if (!props || (props.id && props.id > 0))
        return props
    //
    const sql = `insert into ${tableName} (` +
        'weatherId, type, valid_date, temp, min_temp, max_temp, min_feel_like, max_feel_like, pop, description, iconCode, iconUri, timeAPI ' +
        ') values (' +
        ` ${props.weatherId}, '${props.type}', '${props.valid_date}', ${props.temp}, ` +
        ` ${props.min_temp}, ${props.max_temp}, ${props.min_feel_like}, ${props.max_feel_like}, ` +
        ` ${props.pop}, '${props.description}', '${props.iconCode}', '${props.iconUri}', ` +
        ` ${props.timeAPI} )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}
