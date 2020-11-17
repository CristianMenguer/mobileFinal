import { selectDB, insertDB, execSql } from '../database'

const tableName = 'geolocation'

// This function receives a coordinate object and saves it to the database and returns the object saved
// with the new ID.
export const AddCoordsDB = async (props: Coordinate): Promise<Coordinate> => {
    if (!props || !props.latitude || !props.longitude)
        return props
    //
    if (props.id && props.id > 0)
        return props
    //
    const sql = `insert into coord (latitude, longitude) values (${props.latitude}, ${props.longitude})`

    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}

// This function receives a Coordinate Id and retrieves the Coordinate object
// from the database and returns it.
export const GetCoordByIdDB = async (idCoord: number): Promise<Coordinate> => {

    const response = await selectDB('coord', `id = ${idCoord}`) as Coordinate[]

    if (response.length == 0 || response.length > 1)
        return {} as Coordinate
    //
    return response[0]

}

// This function receives a GeoLocation Id and retrieves the GeoLocation object
// from the database and returns it.
export const LoadGeoLocationDB = async (idCoord: number): Promise<GeoLocation> => {

    const response = await selectDB(tableName, `coordId = ${idCoord}`) as GeoLocation[]

    if (response.length == 0 || response.length > 1)
        return {} as GeoLocation
    //
    return response[0]

}

// This function retrieves all the GeoLocation objects
// from the database and returns them.
export const LoadAllGeoLocationDB = async (): Promise<GeoLocation[]> => {

    const response = await selectDB(tableName) as GeoLocation[]

    return response

}

// This function receives a GeoLocation object and saves it to the database and returns the object saved
// with the new ID.
export const AddGeoLocationDB = async (props: GeoLocation): Promise<GeoLocation> => {
    if (!props || (props.id && props.id > 0))
        return props
    //
    const sql = `insert into ${tableName} (` +
        'coordId, road, city_district, place, city, county, country, formatted, currency_name, currency_code, flag, image_uri ' +
        ' ) values (' +
        `  ${props.coordId}, "${props.road}", "${props.city_district}", "${props.place}", ` +
        ` "${props.city}", "${props.county}", "${props.country}", "${props.formatted}", ` +
        ` '${props.currency_name}', '${props.currency_code}', '${props.flag}', '${props.image_uri}' )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}

// This function receives a GeoLocation Id and deletes it from the database,
// and returns true if there was no error.
export const DeleteGeoLocationDB = async (id: number): Promise<boolean> => {
    if (id < 1)
        return false
    //
    const sql = `delete from ${tableName} where id = ${id}`

    const response = await execSql(sql)

    return response

}

// This function receives a GeoLocation Id and an url image and
// updates it in the database, and returns true if there was no error.
export const UpdateGeoLocationPhotoDB = async (image_uri: string, id: number): Promise<boolean> => {
    if (!image_uri || image_uri === '' || !id || id < 1)
        return false
    //
    const sql = `update ${tableName} set image_uri = '${image_uri}' where id = ${id} `
    //
    const response = await execSql(sql)

    return response

}
