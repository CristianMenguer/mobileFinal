import { execSql, selectDB, insertDB } from '../database'

export const LoadCurrencyRatesDB = async (currencyBase: string): Promise<CurrencyData[]> => {

    const tableName = 'currencyrate'

    const response = await selectDB(tableName, `currencyBase = ${currencyBase} or currencyCompare = ${currencyBase}`) as CurrencyData[]

    if (response.length == 0)
        return []
    //
    return response

}
