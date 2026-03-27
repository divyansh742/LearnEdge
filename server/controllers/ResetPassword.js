const mailSender = require("../utils/mailSender")
const UserModel = require("../models/User")
const bcrypt = require("bcrypt")
const passwordResetTemplate = require("../mail/templates/passwordReset")
const crypto = require("crypto")

const resetPasswordToken = async (req,res) =>{
    try {
        //get email from req body
        const {email}  = req.body
        //check user for this email
        const user = await UserModel.findOne({email:email})
        if(!user){
            return res.status(401).json({
                success: false,
                message: "Your Email is not Registered with us"
            })
        }
        //token generation
        const token = crypto.randomUUID();
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        //update user with token and expiration time
        const updatedDetails = await UserModel.findOneAndUpdate({email:email},{
            token: hashedToken,
            resetPasswordExpires: Date.now() + 5*60*1000
        },{new: true})

        //create url
        const url = `http://localhost:3000/update-password/${token}`
        //send mail containing the url
        const mailTemplate = passwordResetTemplate(user.firstName,url);
        await mailSender(email,"Reset Your Password",mailTemplate)
        //return response
        
        return res.status(200).json({
            success: true,
            message: "Password Reset Link is Succesfully sent to your Email, Check your Email"
        })
    } catch (error) {
        console.log(error) 
        return res.status(401).json({
            success: false,
            message: "Something Went Wrong while reseting the password",
            error: error.message
        })
        
    }
}

const resetPassword = async (req,res)=> {
    try {
        //data fetch
        const {password,confirmPassword,token} = req.body;
        //validation
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Password not matched"
            })
        }
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        //get userdetails from db using token
        const userDetails = await UserModel.findOne({token: hashedToken})
        //if no entry - invalid token
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            })
        }
        //token time check
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success: false,
                message: "Token expired ,Please regenerate your Token"
            })
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password,10)
        //password update and removal of token + expirytime
        const updatedUser = await UserModel.findOneAndUpdate(
            {token: hashedToken},
            { 
                $set:{password: hashedPassword},
                $unset:{token: "", resetPasswordExpires: ""}
            },
            {new: true}
        )
        //return response
        return res.status(200).json({
            success: true,
            email: updatedUser.email,
            message: "Password Reset Sucessfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong Sending Reset password Mail, Please try Again"
        })
        
    }
}
module.exports = {resetPasswordToken,resetPassword}