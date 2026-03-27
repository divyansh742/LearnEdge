const Razorpay = require("razorpay")

const razorpayConnect = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

module.exports = razorpayConnect