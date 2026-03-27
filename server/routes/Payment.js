const express = require("express")
const router = express.Router()


const { capturePayment , verifySignature } = require("../controllers/Payment")
//import auth middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/middleware")

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayments" ,verifySignature) //razorpay will hit this route with payment details

module.exports = router