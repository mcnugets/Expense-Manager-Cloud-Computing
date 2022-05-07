const pool = require('../configs/database');
const bcrypt = require('bcryptjs');
const { getMaxListeners } = require('../configs/database');

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        // check email is exist or not
        let isEmailExist = await checkExistEmail(data.email);
        if (isEmailExist) {
            reject(`This email "${data.email}" already exists!`);
        } else {
            // hash password
            let salt = bcrypt.genSaltSync(10);
            let userItem = {
                email: data.email,
                password: bcrypt.hashSync(data.password, salt),
                username: data.username,
            };

            //create a new account
            pool.query(
                // 'INSERT INTO users (username, email, password) VALUES ("qwerty", "qwerty@gmail.com", "qwerty1")',
                'INSERT INTO users set ? ', userItem,
                function(err, rows) {
                    if (err) {
                        reject("Cannot Create User!!!");
                        console.log(err);
                    }
                    resolve("Account created successfully!");
                }
            );
        }
    });
};

let checkExistEmail = (email) => {
    return new Promise( (resolve, reject) => {
        try {
            pool.query(
                'SELECT * FROM `users` WHERE `email` = ?  ', email,
                function(err, rows) {

                    if (err) {
                        reject(err)
                    }

                    if (rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                }
            );
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createNewUser : createNewUser
};