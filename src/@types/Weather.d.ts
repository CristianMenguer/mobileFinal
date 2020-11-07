interface Weather {
    id?: number
    coordsId?: number
    coords?: Coordinate
    temperature: number
    temp_min: number
    temp_max: number
    feel_like: number
    description: string
    iconCode: string
    iconUri: string
    timeAPI: timestamp
}
