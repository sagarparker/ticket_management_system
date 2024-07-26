const express = require("express");
const { user_signup, user_login } = require("../../controllers/auth/auth");
const router = express.Router();
const {body} = require("express-validator");

//USER SIGNUP
router.post("/users",[
    body('email').isEmail(),
    body('email').notEmpty(),
    body('name').notEmpty(),
    body('password').notEmpty(),
    body('password').isStrongPassword({
        minLength:5
    })],
    user_signup
);

router.post("/auth/login",[
    body('email').isEmail(),
    body('email').notEmpty(),
    body('password').notEmpty(),
    body('password').isStrongPassword({
        minLength:5
    })
],user_login)

module.exports = router;