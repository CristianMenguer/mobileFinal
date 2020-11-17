//Interface used in the whole app to each Currency
interface CurrencyData {
    id: number
    currencyBase: string
    currencyCompare: string
    value: number
    timeAPI: timestamp
}
