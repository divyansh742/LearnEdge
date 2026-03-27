const {Schema,model} = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/templates/emailVerification")

const otpSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 5*60,
    }
},{timestamps: true})

//send email function verify otp

async function sendVerificationEmail(email,otp){
    try {
        const mailResponse = await mailSender(email,"Verification Email for LearnEdge", otpTemplate(otp)); 
    
    } catch (error) {
        console.log("error occured while sending mail", error)
        throw error;
    }
}


otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp)
    next();
})


const otpModel = model("OTP", otpSchema)
module.exports = otpModel