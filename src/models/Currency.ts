import { selectDB, insertDB } from '../database'

const tableName = 'currencyrate'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const LoadCurrencyRatesDB = async (currencyBase: string): Promise<CurrencyData> => {

    const response = await selectDB(tableName, `currencyBase = '${currencyBase}'`) as CurrencyData[]

    if (response.length == 0 || response.length > 1)
        return {} as CurrencyData
    //
    return response[0]

}

// This function receives a currency object and saves it to the database and returns the object saved
// with the new ID.
export const AddCurrencyRateDB = async (props: CurrencyData): Promise<CurrencyData> => {
    if (!props || (props.id && props.id > 0))
        return props
    //
    const sql = `insert into ${tableName} (` +
        'currencyBase, currencyCompare, value, timeAPI ' +
        ' ) values ( ' +
        `'${props.currencyBase}', '${props.currencyCompare}', ${props.value}, ${props.timeAPI} )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}
