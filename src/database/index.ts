import * as SQLite from 'expo-sqlite'
import { SQLVoidCallback, WebSQLDatabase } from 'expo-sqlite'

const startDb = async (): Promise<WebSQLDatabase> => {
    const db = SQLite.openDatabase('./2020087.db')

    return new Promise<WebSQLDatabase>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql('create table if not exists repository (id integer primary key, description text, full_name text, avatar_url text, login text)')
            //
            transaction.executeSql('create table if not exists coord (id integer primary key, latitude real, longitude real)')
            //
            transaction.executeSql('create table if not exists geolocation (id integer primary key, coordId integer, ' +
                'road text, city_district text, place text, city text, county text, country text, formatted text, ' +
                'currency_name text, currency_code text, flag text, image_uri text)')
            //
            transaction.executeSql('create table if not exists currencyrate (id integer primary key, currencyBase text, currencyCompare text, value real, timeAPI real)')
            //
            transaction.executeSql('create table if not exists weather (id integer primary key, coordId integer, temperature real, ' +
                'temp_min real, temp_max real, feel_like real, description text, iconCode text, iconUri text, timeAPI real)')
            //
            transaction.executeSql('create table if not exists forecast (id integer primary key, weatherId integer, type text, ' +
                'valid_date text, temp real, min_temp real, max_temp real, min_feel_like real, max_feel_like real, pop real, ' +
                ' description text, iconCode text, iconUri text, timeAPI real)')
            //

        }, (error) => {
            console.log(`> Database.index > startDb: ${error}`)
            reject(error)
        }, () => {
            resolve(db)
        })
    })
}

export const dropTablesDb = async (): Promise<WebSQLDatabase> => {
    const db = SQLite.openDatabase('./2020087.db')

    return new Promise<WebSQLDatabase>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql('drop table repository')
            transaction.executeSql('drop table coord')
            transaction.executeSql('drop table geolocation')
            transaction.executeSql('drop table currencyrate')
            transaction.executeSql('drop table weather')
            transaction.executeSql('drop table forecast')
        }, (error) => {
            console.log(`> Database.index > dropTablesDb: ${error}`)
            reject(error)
        }, () => {
            resolve(db)
        })
    })
}

export const insertDB = async (sql: string): Promise<number> => {
    const db = await startDb()

    return new Promise<number>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql(sql, [], (tx, results) => {
                //
                if (results.insertId > 0) {
                    resolve(results.insertId)
                } else {
                    console.log('> Database.index > insertDB.insertId == 0')
                    reject(0)
                }
                //
            })

        }, (error) => {
            console.log('> Database.index > insertDB:')
            console.log(error)
            console.log(sql)
            reject(0)
        })
    })
}

export const execSql = async (sql: string): Promise<boolean> => {
    const db = await startDb()

    return new Promise<boolean>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql(sql, [], (tx, results) => {
                if (results.rowsAffected > 0) {
                    resolve(true)
                } else {
                    console.log('> Database.index > execSql.rowsAffected == 0')
                    resolve(true)
                }
                //
            }, (error) => {
                console.log('> Database.index > execSql')
                console.log(error)
                console.log(sql)
                return false
            })

        }, (error) => {
            console.log(`> Database.index > execSql: ${error}`)
            reject(false)
        }, () => {
            resolve(true)
        })
    })
}

export const selectDB = async (tableName: string, where: string = '') => {
    const db = await startDb()

    const sql = `select * from ${tableName} ${where != '' ? 'where ' + where : ''}`
    return new Promise<Object[]>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql(sql, [], (transaction, results) => {
                let objs: Object[] = []
                for (let index = 0; index < results.rows.length; index++)
                    objs.push(results.rows.item(index))
                //
                resolve(objs)
            })

        }, (error) => {
            console.log('> Database.index > select:')
            console.log(error)
            console.log(sql)
            reject([])
        }, () => {
            resolve([])
        })
    })
}

export const selectByIdDB = async (tableName: string, id: number) => {
    const db = await startDb()
    const sql = `select * from ${tableName} where id = ${id}`

    return new Promise<Object>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql(sql, [], (transaction, results) => {
                if (results.rows.length > 0) {
                    resolve(results.rows.item(0))
                    //
                }
            })

        }, (error) => {
            console.log('> Database.index > select:')
            console.log(error)
            console.log(sql)
            reject()
        })
    })
}
