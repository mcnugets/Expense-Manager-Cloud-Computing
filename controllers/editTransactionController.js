
const pool = require('../configs/database');

let getEditTransactionsPage = (req, res) => {

    return res.render('editTransaction', {
        title: 'Edit Transactions',
        user: req.user
    });
};


let editTransaction = (req, res) => {

    const id = req.params.transaction_id;
    // SELECT category, amount, date_format(transaction_date, "%y/%m/%d") as transaction_date FROM transactions;

    var sql = `SELECT category, amount, transaction_id, date_format(transaction_date, "%d/%m/%y") as transaction_date FROM transactions WHERE transaction_id="${id}"`;
    pool.getConnection(async (err, connection) => {
        connection.query(sql, function (err, data) {
            if (err) throw err;

            res.render('editTransaction', { title: 'User List', editdata: data[0] });
            console.log("User List: ", data)
        });
    });

}

let updateTransaction = (req, res) => {

    pool.getConnection(async (err, connection) => {

        const id = req.params.transaction_id;
        console.log('id:,',id);
        const body = req.body;
        console.log('body: ', body);
        const sql = 'UPDATE transactions SET ? WHERE transaction_id = ?';
        console.log(' Updated.. ' + body.changeid);


        if (err) throw err;
        await connection.query(sql, [body, id], (err, data) => {

            if (err) throw err;
            console.log(data.affectedRows + " record(s) updated");

        })
        connection.release();
        return res.redirect('/transactions');


    })

}



module.exports = {
    getEditTransactionsPage: getEditTransactionsPage,
    editTransaction: editTransaction,
    updateTransaction: updateTransaction
};