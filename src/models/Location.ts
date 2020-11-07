import { execSql, selectDB, insertDB } from '../database'

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

export const LoadGeoLocationDB = async (idCoord: number): Promise<GeoLocation> => {

    const tableName = 'geolocation'

    const response = await selectDB(tableName, `coordid = ${idCoord}`) as GeoLocation[]

    if (response.length == 0 || response.length > 1)
        return {} as GeoLocation
    //
    return response[0]

}

export const AddGeoLocationDB = async (props: GeoLocation): Promise<GeoLocation> => {
    if (!props || (props.id && props.id > 0))
        return props
    //
    const sql = `insert into geolocation (' +
        'coordid, road, city_district, place, city, county, country, formatted, currency_name, currency_code) ' +
        'values (' +
        '${props.coords?.id}, '${props.road}', '${props.city_district}', '${props.place}', ' +
        ' '${props.city}', '${props.county}', '${props.country}', '${props.formatted}', ' +
        ' '${props.currency_name}', '${props.currency_code}' ' +
        ')`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}
