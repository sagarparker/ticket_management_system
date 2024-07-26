const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.isAuthenticated=(req,res,next)=>{
    try {
        let token = req.headers["authorization"];
        if(!token){
            return res.status(401).json({
                message:"Invalid auth token"
            })
        }
        let auth_token = token.split(" ");
        jwt.verify(auth_token[1],process.env.JWT_TOKEN_SECRET,function(err,payload){
            if(err){
                return res.status(401).json({
                    msg:"User authentication failed"
                })
            }else{
                req.decoded = payload
                next()
            }
        })
    } catch (error) {
        res.status(500).json({
            msg:"There was an issue while authenticating the user"
        })       
    }
}