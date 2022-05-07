const {check} = require('express-validator');

let validateSignup = [

    check("email", "Invalid email").isEmail().trim(),

    check("password", "Password must be at least 4 chars long").isLength({min: 4}),

];

let validateLogin = [
    check("email", "Invalid email").isEmail().trim(),

    check("password", "Invalid password")
    .not().isEmpty()
];

module.exports = {
    validateSignup : validateSignup,
    validateLogin: validateLogin
}