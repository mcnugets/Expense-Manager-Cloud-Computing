const {validationResult} = require('express-validator');
const signupService = require('../services/signupService');

let getSignupPage = (req, res) => {
    return res.render('signup', {
        title: 'Sign Up',
        errors: req.flash("errors")
    });
};

let createNewUser = async (req, res) => {
    //validate required fields
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/signup");
    }


    //create new user
    try {
        let newUser = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        await signupService.createNewUser(newUser);
        return res.redirect('/login');
    } catch (e) {
        req.flash("errors", e);
        return res.redirect("/signup");
    }

};

module.exports = {
    getSignupPage : getSignupPage,
    createNewUser : createNewUser
};