import { selectDB, insertDB } from '../database'

const tableName = 'geolocation'

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

export const GetCoordByIdDB = async (idCoord: number): Promise<Coordinate> => {

    const response = await selectDB('coord', `id = ${idCoord}`) as Coordinate[]

    if (response.length == 0 || response.length > 1)
        return {} as Coordinate
    //
    return response[0]

}

export const LoadGeoLocationDB = async (idCoord: number): Promise<GeoLocation> => {

    const response = await selectDB(tableName, `coordId = ${idCoord}`) as GeoLocation[]

    if (response.length == 0 || response.length > 1)
        return {} as GeoLocation
    //
    return response[0]

}

export const LoadAllGeoLocationDB = async (): Promise<GeoLocation[]> => {

    const response = await selectDB(tableName) as GeoLocation[]

    return response

}

export const AddGeoLocationDB = async (props: GeoLocation): Promise<GeoLocation> => {
    if (!props || (props.id && props.id > 0))
        return props
    //
    const sql = `insert into ${tableName} (` +
        'coordId, road, city_district, place, city, county, country, formatted, currency_name, currency_code, flag ' +
        ' ) values (' +
        `  ${props.coordId}, "${props.road}", "${props.city_district}", "${props.place}", ` +
        ` "${props.city}", "${props.county}", "${props.country}", "${props.formatted}", ` +
        ` '${props.currency_name}', '${props.currency_code}', '${props.flag}' )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}
