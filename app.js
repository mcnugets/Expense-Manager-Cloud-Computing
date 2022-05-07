require('dotenv').config()

// const loginController = require('./controllers/loginController');
// const signupController = require('./controllers/signupController');
// const indexController = require('./controllers/indexController');
// const transactionsController = require('./controllers/transactionsController');
// const auth = require('./validation/authValidation')
// const initPassportLocal = require('./controllers/passportLocalController');

const initWebRoutes = require('./routes/web');
const pool = require('./configs/database');

const express = require('express');
const app = express();
const path = require('path');

const ejsMate = require('ejs-mate');

const mysql = require('mysql');


const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const session = require('express-session');

const passport = require('passport');


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'));

//Enable body parser post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));

//Enable flash message
app.use(connectFlash());

app.use(express.json());

// app.use((req,res,next) => {
//     res.locals.currentUser = req.user;
//      console.log("on app..", req.user);
//     next();
// })

// app.get('/dogs', async(req,res) => {
//     const ensureSchema = async pool => {
//         // Wait for tables to be created (if they don't already exist).
//         await pool.query(
//           `CREATE TABLE IF NOT EXISTS votes
//             ( vote_id SERIAL NOT NULL, time_cast timestamp NOT NULL,
//             candidate CHAR(6) NOT NULL, PRIMARY KEY (vote_id) );`
//         );
//         console.log("Ensured that table 'votes' exists");
//       };
// });

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER, 
//     password: process.env.DB_PASS, 
//     database: process.env.DB_DATABASE,
// });


// app.get("/", async(req, res) => {
//     pool.getConnection((err, connection) => {
//         console.log('connected as id ' + connection.threadId);
//         connection.query('SELECT * FROM users', (err, rows) => {
//             connection.release(); //return the connection to pool
//             if(err) throw err;
//             console.log('The data from users table are: \n', rows);
//         });
//     });
// });


app.get('/status', (req,res) => res.send('Working!'));

// app.get('/', async(req, res) => {
//     res.render('index')     
//     //res.json({status: "BARK BARK!!"});
// })

// app.get('/', loginController.checkLoggedIn, indexController.getIndexPage);

// app.get('/transactions', (req,res) => {
//     res.render('transactions')
// })

// app.get('/transactions', transactionsController.getTransactionsPage);


// app.get('/login', (req,res) => {
//     res.render('login')
// })

// app.get('/login', loginController.checkLoggedOut, loginController.getLoginPage);
// app.post('/login', passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     successFlash: true,
//     failureFlash: true
// }));

// // app.get('/signup', (req, res) => {
// //     res.render('signup')
// // })

// app.get('/signup', signupController.getSignupPage);

// app.post('/signup', auth.validateSignup, signupController.createNewUser);


// app.post('/logout', loginController.postLogOut);

// app.listen(8080, () => {
//     console.log('ON PORT 8080');
// })


//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
initWebRoutes(app);


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`RUNNING ON PORT ${port}`);
})