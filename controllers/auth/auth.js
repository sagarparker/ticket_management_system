const bcrypt = require('bcrypt');
const pg = require('pg');
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');
const jwt = require("jsonwebtoken");
require("dotenv").config()

const pool = new pg.Pool({
    connectionString: process.env.POSTGRES_URL,
})

const generateJwtToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_TOKEN_SECRET,{
        expiresIn:'10d'
    })
}

const user_signup = async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors)
            return res.status(400).json({
                msg:"Invalid user details",
                error: errors.array()[0]
            })
        }
        let name = req.body.name;
        let password = req.body.password;
        let email = req.body.email;
        let user_id = uuidv4();
        let hashed_password = await bcrypt.hash(password, 10)
        let query = await pool.query("INSERT INTO USERS VALUES($1,$2,$3,$4)",[email,name,hashed_password,user_id]);
        if(query.rowCount>0){
            res.status(200).json({
                id: user_id,
                name: name,
                email: email
            })
        }else{
            res.status(500).json({
                msg:"There was an issue while registering the user"
            })   
        }
    } catch (error) {
        console.log(error);
        if(error.code === '23505'){
            res.status(400).json({
                msg:"Email needs to be unique"
            })
        }else{
            res.status(500).json({
                msg:"There was an issue while registering the user"
            })
        }

    }
}

const user_login = async(req,res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors)
            return res.status(400).json({
                msg:"Invalid user details",
                error: errors.array()[0]
            })
        }
        let email = req.body.email;
        let password = req.body.password;

        let query = await pool.query(
            `
            SELECT * FROM USERS
            WHERE email=
            $1
            `,
            [email]
        );

        if(query.rowCount==0){
            return res.status(404).json({
                msg:`User with ${email} not found`
            })
        }

        const isPasswordValid = await bcrypt.compare(password,query.rows[0].password);
        if(!isPasswordValid){
            return res.status(401).json({
                msg:"Invalid email or password"
            })
        }

        let payload_data = {
            email : email,
            user_id : query.rows[0].id
        }

        let jwt_token = generateJwtToken(payload_data);
        if(!jwt_token){
            return res.status(500).json({
                msg:"There was an issue while generating the jwt token"
            })
        }

        return res.status(200).json({
            token: jwt_token
        })
    } catch (error) {
        res.status(500).json({
            msg:"There was an issue while user login"
        })
    }
}

module.exports = {user_signup,user_login};