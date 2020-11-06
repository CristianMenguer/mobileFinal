import * as SQLite from 'expo-sqlite'

export const openDb = async () => {
    const db = SQLite.openDatabase('./2020087.db')
    db.transaction((tx) => {
        tx.executeSql('drop table address')
        tx.executeSql('create table if not exists address (id integer primary key, latitude real, longitude real)')
        tx.executeSql('insert into address (latitude, longitude) values (56, -6)')
        tx.executeSql('insert into address (latitude, longitude) values (1, 8)')
        tx.executeSql('insert into address (latitude, longitude) values (7, -15)')
        tx.executeSql('select * from address', [], (trans, result) => {
            console.log(result.rows.length)
            for(let i = 0; i < result.rows.length - 1; i++)
                console.log(result.rows.item(i))
        })

    }, (error) => {
        console.log(error)
    }, () => {
        console.log('success')
    })
}
