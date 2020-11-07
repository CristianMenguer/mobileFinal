import * as SQLite from 'expo-sqlite'
import { SQLVoidCallback, WebSQLDatabase } from 'expo-sqlite'

const startDb = async (): Promise<WebSQLDatabase> => {
    const db = SQLite.openDatabase('./2020087.db')

    return new Promise<WebSQLDatabase>((resolve, reject) => {
        db.transaction((transaction) => {
            //transaction.executeSql('drop table repository')
            transaction.executeSql('create table if not exists address (id integer primary key, latitude real, longitude real)')
            transaction.executeSql('create table if not exists repository (id integer primary key, description text, full_name text, avatar_url text, login text)')

        }, (error) => {
            console.log(`> Database.index > startDb: ${error}`)
            reject(error)
        }, () => {
            resolve(db)
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

export const selectDB = async (tableName: string) => {
    const db = await startDb()

    return new Promise<Object[]>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql(`select * from ${tableName}`, [], (transaction, results) => {
                let objs: Object[] = []
                for (let index = 0; index < results.rows.length; index++)
                    objs.push(results.rows.item(index))
                //
                resolve(objs)
            })

        }, (error) => {
            console.log(`> Database.index > select: ${error}`)
            reject([])
        }, () => {
            resolve([])
        })
    })
}

export const selectByIdDB = async (tableName: string, id: number) => {
    const db = await startDb()

    return new Promise<Object>((resolve, reject) => {
        db.transaction((transaction) => {
            transaction.executeSql(`select * from ${tableName} where id = ${id}`, [], (transaction, results) => {
                if (results.rows.length > 0) {
                    resolve(results.rows.item(0))
                //
                }
            })

        }, (error) => {
            console.log(`> Database.index > select: ${error}`)
            reject()
        })
    })
}
