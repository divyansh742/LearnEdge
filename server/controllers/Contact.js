const contactUsTemplate = require("../mail/templates/contact")
const mailSender = require("../utils/mailSender")

const contactUs = async (req,res) =>{
    try {
        const {email,firstName, lastName,message, phoneNo} = req.body;
        const emailRes = mailSender(email,"We have recieved your data",contactUsTemplate(email,firstName,lastName,phoneNo,message))
        return res.status(200).json({
            success: true,
            message: "Sent contact confirmation mail successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while sending contact confirmation mail",
            error: error.message,
        })
    }
}
module.exports = contactUs