const express= require('express');
const router= express.Router();

const{login, signup}= require('../controllers/auth')
const { authn,isAdmin,isStud} = require("../middlewares/auth")

router.post('/login', login);
router.post('/signup', signup);

router.get('/test', authn, (req,res)=>{
    res.json({
        success: true,
        message: "testing done"
    })
})

router.get('/student', authn,isStud, (req,res)=>{
     res.json({
        success: true,
        message: "welcome stud"
    })
})

router.get('/admin', authn, isAdmin, (req,res)=>{
    res.json({
        success: true,
        message: "welcome admin"
    })
})

module.exports= router;