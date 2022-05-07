require('dotenv').config();
const mysql = require('mysql');

// Database Connection for Production

// let config = {
//     user: process.env.SQL_USER,
//     database: process.env.SQL_DATABASE,
//     password: process.env.SQL_PASSWORD,
// }

// if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
//   config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
// }

// let connection = mysql.createConnection(config);

// Database Connection for Development

const pool = mysql.createPool({
  
  
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASS, 
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
   // socketPath: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
    multipleStatements: true
});

pool.getConnection(function(error){
  if (error) throw err;
  console.log("Database connected!");
  });  

 module.exports = pool; 

//     connection.connect(function(err){
//         if(err){
//             console.error('Error connectiong: ' + err.stack);
//             return;
//         }
//         console.log('Connected as thread id: ' + connection.threadId);
//     });

//     module.exports = connection;