const express = require('express');
const loginController = require('../controllers/loginController')
const signupController = require('../controllers/signupController');
const indexController = require('../controllers/indexController');
const transactionsController = require('../controllers/transactionsController');
const auth = require('../validation/authValidation');
const passport = require('passport');
const initPassportLocal = require('../controllers/passportLocalController');
const editTransactionController = require('../controllers/editTransactionController');
const graphsController = require('../controllers/graphsController');

// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/', (req, res) => {
    //     res.render('index', {
    //         title: 'Dashboard'
    //     })
    // })
    router.use((req,res,next) => {
        res.locals.currentUser = req.user;
        // console.log("user:", req.user);
        next();
    })

    router.get("/", loginController.checkLoggedIn, indexController.getTransactionsAndGraphs, indexController.getIndexPage);
   
    router.get("/login",loginController.checkLoggedOut, loginController.getLoginPage);
    router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/signup", signupController.getSignupPage);
    router.post("/signup", auth.validateSignup, signupController.createNewUser);
    router.post("/logout", loginController.postLogOut);

    router.get('/transactions', loginController.checkLoggedIn, transactionsController.getTransactionsPage);

    router.post('/transaction_insert', transactionsController.submitTransaction);

    router.get('/delete/:transaction_id', transactionsController.deleteTransaction);

    router.get('/search_by_date', transactionsController.searchByDate);

 //   router.get('/save/:transaction_id', transactionsController.editTransaction);

    router.get('/save/:transaction_id', editTransactionController.editTransaction, editTransactionController.getEditTransactionsPage);

    router.post('/update/:transaction_id', editTransactionController.updateTransaction);

    router.get('/graphs', graphsController.getGraphsPage);

    router.get('/pass_json', graphsController.passJSONData);

    return app.use("/", router);


};
module.exports = initWebRoutes;

