const express = require("express")
const router = express.Router()
//import auth controllers
const {logIn,signUp,sendOTP,changePassword, logOut} = require("../controllers/Auth")


//import reset password
const {resetPasswordToken,resetPassword} = require("../controllers/ResetPassword")

const {auth} = require("../middlewares/middleware")

/****** Authentication Route ************/

router.post("/login", logIn)
router.post("/signup", signUp)
router.post("/sendOtp", sendOTP)
router.post("/logout", auth, logOut)
router.post("/changePassword",auth , changePassword)

/********** resetPassword Route **********/

router.post("/resetPasswordToken", resetPasswordToken)
router.post("/resetPassword", resetPassword)

module.exports = router


