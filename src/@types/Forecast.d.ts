//Interface used in the whole app to Forecast, daily or hourly
interface Forecast {
    id?: number
    weatherId?: number
    type: string = 'daily' | 'hourly'
    valid_date: string
    temp: number
    min_temp: number
    max_temp: number
    min_feel_like: number
    max_feel_like: number
    pop: number
    description: string
    iconCode: string
    iconUri: string
    timeAPI: timestamp
}
