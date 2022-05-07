const pool = require('../configs/database');

let getGraphsPage = (req, res) => {

    return res.render('graphs', {
        title: 'Graphs',
        user: req.user
    });
};


let passJSONData = (req, res) => {

    pool.getConnection(async (err, connection) => {

        if (err) throw err;

        let userId = res.locals.currentUser.id;

        // const sql = `select amount, round(unix_timestamp(str_to_date(transaction_date, '%Y-%m-%d')) * 1000) as transaction_date from transactions order by transaction_date asc`;
            const sql = `select amount, round(unix_timestamp(str_to_date(transaction_date, '%Y-%m-%d')) * 1000) as transaction_date from transactions WHERE user_id = ${userId} order by transaction_date asc;`
        await connection.query(sql, function (err, rows) {
            try {
                res.send(rows);
                console.log(rows);
            }
            catch (err) {
                throw err;
            }
        })
    });
}


module.exports = {
    getGraphsPage: getGraphsPage,
    passJSONData: passJSONData
}