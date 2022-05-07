const pool = require('../configs/database');

let getIndexPage = (req, res) => {
    return res.render('index', {
        title: 'Dashboard',
        user: req.user
    })
};

let getTransactionsAndGraphs = (req, res) => {

    pool.getConnection(async (err, connection) => {
        if (err) throw err;

        let userId = res.locals.currentUser.id;

        const sql = `SELECT * FROM transactions
                WHERE (YEAR(transaction_date) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
                AND MONTH(transaction_date) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)) AND user_id = ${userId};
                SELECT category, amount, date_format(transaction_date, "%d/%m/%y") as transaction_date, transaction_id, user_id FROM transactions WHERE user_id = ${userId} order by transaction_date asc`;

        connection.query(sql, [1, 2], (err, result) => {
            if (err) {

                throw err;

            } else {
                return res.render('index', {
                    title: 'DASHBOARD',
                    dash_data: result,
                    user: req.user
                })
            }
            
        });
    });
};


module.exports = {
    getIndexPage: getIndexPage,
    getTransactionsAndGraphs: getTransactionsAndGraphs
};