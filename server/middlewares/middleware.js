const jwt = require("jsonwebtoken")
const UserModel = require("../models/User")

//auth
const auth = async (req,res,next) => {
    try {
        const token = req.cookies?.token
        || req.body?.token
        || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            })
        }
        //verify the token
        try {
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            req.user = decode;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is Invalid"
            })
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while validating the token"
        })
        
    }
}

//isStudent
const isStudent = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected route for Students Only"
            })
        }
        next();
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , Please try Again Later"
        })
    }
}

//isInstructor
const isInstructor = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected route for Instructor Only"
            })
        }
        next()
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , Please try Again Later"
        })
    }
}
//isAdmin
const isAdmin = async (req,res,next) => {
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "This is a Protected route for Admin Only"
            })
        }
        next()
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User role cannot be verified , Please try Again Later"
        })
    }
}

module.exports = {auth,isStudent,isInstructor,isAdmin}