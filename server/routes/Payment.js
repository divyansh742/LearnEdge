const express = require("express")
const router = express.Router()


const { capturePayment , verifySignature, verifyPurchase } = require("../controllers/Payment")
//import auth middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/middleware")

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayments" ,verifySignature) //razorpay will hit this route with payment details
router.post("/verifyPurchase",auth ,isStudent, verifyPurchase);

module.exports = router