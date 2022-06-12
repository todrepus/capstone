const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');



//테이블 생성코드
if (!fs.existsSync('src/db/user.db')){
    let db = new sqlite3.Database('src/db/user.db');
    db.run(`CREATE TABLE User(id integer primary key,
        name text not null,
        password text not null,
        nickname text unique,
        phone_number text unique,
        email text unique)`,
        function(err) {
            if (err){
                return console.log(err.message);
            }
        });
    db.close();
}




const UserDB = {
    createUser : (name, password, nickname, phone_number, email) => new Promise((resolve, reject) => {
        let db = new sqlite3.Database('src/db/user.db');
        db.run(`INSERT INTO User(name, password, nickname, phone_number, email) 
        VALUES('${name}', '${password}', '${nickname}', '${phone_number}', '${email}')`, (err) => {
            if(err){
                db.close();
                reject({ status: false, message: err });
                return;
            }
            db.close();
            resolve({ status: true, message: `Succees to bulk insert` });

        }) 
    }),

    readUserByEmail : email => new Promise((resolve, reject) => {
        let db = new sqlite3.Database('src/db/user.db');
        let result;
        db.all(
            `SELECT * FROM User WHERE email = "${email}"`, [],
            (err, rows) => {
                if (err){
                    db.close();
                    reject({message : err});
                    return;
                }
                if (rows.length == 0){
                    reject({message : 'no row'});
                    return;
                }
                rows.forEach((row) => {
                    result = row;
                    console.log(result);
                    db.close();
                    resolve({message : result});
                })
            }
        )
    }),

    update : () => Promise((resolve, reject) => {
        let db = new sqlite3.Database('src/db/user.db');
        db.run(
            `UPDATE User SET email = 'dkwk3026@naver.com'
            WHERE name = "강현우"`, function(err){
                if (err){
                    db.close()
                    reject(err.message);
                    return;
                }
                db.close();
                resolve(`Row(s) updated: ${this.changes}`);
            }
        )
    }),

    deleteUserByPhoneNumber : phone_number => ((resolve, reject) => {
        let db = new sqlite3.Database('src/db/user.db');
        db.run(
            `DELETE FROM User WHERE phone_number="${phone_number}"`, function(err) {
                if (err){
                    db.close();
                    reject(err.message);
                    return;
                }
                resolve(`Row(s) deleted ${this.chagnes}`);
            }
        )
        
    })
}

module.exports = {
    UserDB : UserDB
}