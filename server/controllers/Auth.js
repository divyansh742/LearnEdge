const UserModel = require("../models/User");
const otpModel = require("../models/OTP");
const otpGenerator = require("otp-generator");
const ProfileModel = require("../models/Profile");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const passwordUpdateTemplate = require("../mail/templates/passwordUpdate");
//sendOTP

const sendOTP = async (req,res) => {
    try {
        //fetch email from req body
        const {email} = req.body;

        //check if user exists
        const checkUserPresent = await UserModel.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success : false,
                message: "User Already Exists"
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets : false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        console.log("OTP generated: ", otp);

        //otp insertion in db
        const otpPayload = {email,otp};
        const otpBody = await otpModel.create(otpPayload);
        console.log(otpBody)

        res.status(200).json({
            success: true,
            message: "OTP Sent Succesfully"
        })
    }catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};



//signup
const signUp = async (req,res) => {
    try{
        //fetch data from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp
        } = req.body;


        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        //match password with confirmPassword
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and ConfirmPassword doesn't matches, please try again"
            })
        }

        //check user already exists
        const existingUser = await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already registerd with this email"
            })
        }

        //finding most recent otp
        const recentOTP = await otpModel.find({email}).sort({createdAt: -1}).limit(1);
        console.log("this is recent opt object", recentOTP)
        //validating otp
        if(recentOTP.length === 0){
            return res.status(400).json({
                success: false,
                message : "OTP not found"
            })
        }
        else if( otp !== recentOTP[0].otp){
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        //hash password
        const hashPassword = await bcrypt.hash(password,10);

        //create user
        let approved = "";
        approved === "Instructor" ? (approved = false) : (approved = true);
           

        //create entry in db

        const profileDetails = await ProfileModel.create({
            gender: null,
            dateOFBirth: null,
            about: null,
            contactNumber: null 
        })

        const user = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName }`
        })
        user.password = undefined;
        return res.status(200).json({
            success: true,
            message: "User is registered Succesfully",
            user,
        })
    }catch(error){

        console.log(error)
        return res.status(403).json({
            success: false,
            message: "User cannot be Registered, Please try Again"
        })
    }
}

 
//login
const logIn = async (req,res) => {
    try {
        //get data from req body
        const {email,password} = req.body;
        //validation
        if(!email || !password){
            return res.status(401).json({
                success: false,
                message: "All fields are required, please try again"
            })
        }
        //check user exists or not
        const user = await UserModel.findOne({email}).select("+password").populate("additionalDetails");//populated actual data(document) in addtionalDetails rather than just objectID
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered , please signup first"
            })
        }
        //generate JWT token after password matching,
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email: user.email,
                id : user._id,
                accountType : user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn: "2h",
            })
            user.token = token
            user.password = undefined
            //generate cookie and send response

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000)
            }
            res.cookie("token",token,options).status(200).json({
                success: true,
                token,
                user,
                message: "LoggedIn Successfully"
            })

        }
        else{
            return res.status(401).json({
                success: false,
                message: "Password is Incorrect",
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Login Failure , Please try Again",
        })
    }
}

//logOut 
const logOut = async (req,res) => {
    try {
        //remove cookie to logout
        return res.cookie("token","",{
            expires: new Date(0)
        }).status(200).json({
            success: true,
            message: "Logged Out Successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Something went wrong while logging out",
            error: error.message,
        })
        
    }
    
}

//changePassword
const changePassword = async (req,res) =>{
    try {
        //get data from req body
        // get old password , newPassword, confirmPassword
        const {email,oldPassword,confirmPassword,newPassword} = req.body;
        //validation
        if(!email || !oldPassword || !confirmPassword || !newPassword){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        if(newPassword !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "password or confirm password doesn't match"
            })
        }

        const user = await UserModel.findOne({email}).select("+password")
        if(!user){
            return res.status(401).json({
                success: false,
                message: "User is not registered"
            })
        }
        if(await bcrypt.compare(oldPassword,user.password)){
            const updatedPassword = await bcrypt.hash(newPassword,10)
            //upadate in DB
            user.password = updatedPassword;
            await user.save()
            //send mail for Updated Password
            const mailTemplate = passwordUpdateTemplate(email,user.firstName)
            try {
                const mailResponse = await mailSender(email,"Password Updated Successfully",mailTemplate)
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "Error Sending Confirmation Mail",
                    error: mailResponse 
                })
            }
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Incorrect Password"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(402).json({
            success: false,
            message: "Error changing Password, Please try Again"
        })
        
    }
}

module.exports = {sendOTP,signUp,logIn,logOut,changePassword}