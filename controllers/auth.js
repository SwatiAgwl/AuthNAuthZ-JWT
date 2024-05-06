const bcrypt= require('bcrypt');
const User= require('../models/User');
const jwt = require("jsonwebtoken")
require('dotenv').config();


exports.signup = async(req,res)=>{
    try{
        const {name,email,password,role}= req.body;
        // already existing
        
        const existing = await User.findOne({email});
        
        if( existing){
            return res.status(400).json({
                status: false,
                message: "already existing user with given email"
            })
        }
        
        // hash password
        let hashedPass;
        try{
            hashedPass= await bcrypt.hash(password,10);
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "error in hashing pwd"
            })
        }

        // create entyr in db
        const newUser= await User.create({name,email,password: hashedPass,role})
        return res.status(200).json({
            success: true,
            message: "db entry created succ"
        })
        

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "sign up later"
        })
    }

}


// login
exports.login= async(req,res)=>{
    try{
        const {email, password}= req.body;
        if( !email || !password){
            return res.status(400).json({
                status: false,
                message: "pl fill all the details"
            })
        }
        
        const userExists= await User.findOne({email});
        if( !userExists){
            return res.status(401).json({
                status: false,
                message: "user not registered, pl signup first"
            })
        }

        const payload= {
            email,
            _id: userExists._id,
            role: userExists.role
        }
        // check valid password
        if( await bcrypt.compare(password, userExists.password)){
            // generate token
            const token= jwt.sign(payload,process.env.jwt_secret,{
                expiresIn: '2h',
            });

            //console.log(typeof userExists);
            //userExists= {...userExists,token}
            //userExists= userExists.toObject();
            //console.log(typeof userExists);

            userExists.newtoken= token;
            userExists.password= undefined;

            const options= {
                httpOnly: true,
            }
            return res.cookie("cookie1", token, options).status(200).json({
                status: true,
                message: "login successful",
                data: userExists,
                token: token,
            })
        }
        else{
            return res.status(400).json({
                status: false,
                message: "incorrect password"
            })
        }
    }
    catch(error){
        res.status(403).json({
            status: false,
            message: "can't login ,pl try later",
        })
    }
}