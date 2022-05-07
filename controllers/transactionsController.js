const transactionsService = require('../services/transactionsService');
const pool = require('../configs/database');
const { generateId } = require('../services/transactionsService');

let getTransactionsPage = (req, res) => {

    const user_id = res.locals.currentUser.id;

    // const sql = 'SELECT * FROM transactions WHERE user_id = ?';
   const sql = 'SELECT category, amount, date_format(transaction_date, "%d/%m/%y") as transaction_date, transaction_id, user_id FROM transactions WHERE user_id = ? order by transaction_date asc';

    pool.query(sql, [user_id], function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('transactions', { data: '' });
        } else {
            // console.log("data..", rows);
            return res.render('transactions', {
                title: 'Transactions',
                user: req.user,
                data: rows
            });
        }
    });

    
};


// let getTransactionsData = async (req, res) => {

//     const user_id = res.locals.currentUser.id;

//     const sql = 'SELECT * FROM transactions WHERE user_id = ?';
//     // const sql = 'SELECT category, amount, date_format(%y %m %d, transaction_date) as transaction_date FROM transactions WHERE user_id = ?';


//     await pool.query(sql, [user_id], function (err, rows) {

//         if (err) {
//             req.flash('error', err);
//             res.render('transactions', { data: '' });
//         } else {

//             res.render('transactions', { data: rows });
//         }
//     });
// }


let submitTransaction = (req, res) => {

    let transAmount = req.body.amount;
    let transCategory = req.body.category;
    let transDate = req.body.transaction_date;
    let transId = generateId();
    let userId = res.locals.currentUser.id;

    // res.send(console.log(transAmount, transCategory, transDate, transId, userId));

    var sql = `INSERT INTO transactions (amount, category, transaction_date, transaction_id, user_id) VALUES('${transAmount}','${transCategory}', '${transDate}','${transId}', '${userId}')`;

    pool.query(sql, function (err, results) {

        if (err) {
            throw err;
        } else {
            console.log('record inserted');
            req.flash('success', 'Data added successfully!');
            return res.redirect('/transactions');
        }
    });
}


let deleteTransaction = (req, res) => {

    pool.getConnection(async (err, connection) => {

        const id = req.params.transaction_id;
        const sql = 'DELETE FROM transactions WHERE transaction_id = ?';

        if (err) throw err;

        await connection.query(sql, [id], function (err, data) {
            if (err) throw err;
            // console.log(data.affectedRows + " record(s) updated");
        });

        connection.release();
        return res.redirect('/transactions');
    });

}

let searchByDate = (req, res) => {

    pool.getConnection(async (err, connection) => {

        const date_requested = req.query
        let userId = res.locals.currentUser.id;

        // const sql = `SELECT * from transactions WHERE user_id = '${userId}' AND transaction_date BETWEEN ? AND ?`;
        const sql = `SELECT category, amount, date_format(transaction_date, "%d/%m/%y") as transaction_date, transaction_id, user_id FROM transactions WHERE user_id = '${userId}' AND transaction_date BETWEEN ? AND ? order by transaction_date asc`
        if (err) throw err;

        console.log(date_requested.start_date);
        console.log(date_requested.end_date);
        await connection.query(sql, [date_requested.start_date, date_requested.end_date], function (err, rows) {
            if (err) throw err;
            // console.log(rows.affectedRows + " record(s) updated");
            res.render('transactions', { title: "Transactions", data: rows });

        });

        connection.release();

    });
}





module.exports = {
    getTransactionsPage: getTransactionsPage,
    // getTransactionsData: getTransactionsData,
    submitTransaction: submitTransaction,
    deleteTransaction: deleteTransaction,
    searchByDate: searchByDate,
    
};