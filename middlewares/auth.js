const jwt= require("jsonwebtoken");
require("dotenv").config();

// middlewares for: authn, isStudent, isAdmin


// authenticating middleware
exports.authn= (req,res,next)=>{
    try{
        console.log("body", req.body.token);
        console.log("cookie", req.cookies.cookie1);
        console.log("header", req.header("Authorization"));
       // const token= req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");
        const token= req.cookies.cookie1 || req.body.token || req.header("Authorization").replace("Bearer ", "");
        if( !token || token===undefined){
            return res.status(400).json({
                success: false,
                message: "token missing"
            })
        }
        try{
            const payload= jwt.verify(token,process.env.jwt_secret);
            console.log(payload);
            req.user= payload;
            // return res.status(200).json({
            //     success: true,
            //     message: "token verified"
            // });

            
        }
        catch(error){
            console.log(error);
            return res.status(401).json({
                success: false,
                message: "invalid token"
            })
        }
        next();
        
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "some error while authenticating"
        })
    }
}


// authorizing - student's access
exports.isStud= (req,res,next)=>{
    try{
        if( req.user.role !== "student"){
            return res.status(400).json({
                success: false,
                message: "Student view is protected, you don't have access rights"
            })
        }
        next();
        
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "error while fetching stud role"
        })
    }
}

// authorizing - admin's access
exports.isAdmin= (req,res,next)=>{
    try{
        if( req.user.role !== "admin"){
            return res.status(400).json({
                success: false,
                message: "admin view is protected, you don't have access rights"
            })
        }
        next();
        
    
    }catch(error){   
        return res.status(500).json({
            success:false,
            message:  "error while fetching adminrole"
    })
}
}
