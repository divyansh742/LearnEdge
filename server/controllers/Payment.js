const razorpayConnect = require("../config/razorpay")
const CourseModel = require("../models/Course")
const UserModel = require("../models/User")
const courseProgressModel = require("../models/CourseProgress")
const crypto = require("crypto")
const mailSender = require("../utils/mailSender")
const mailTemplate = require("../mail/templates/courseEnrollment")
const { default: mongoose } = require("mongoose")

//capture payment and initiate razorpay order
const capturePayment = async (req,res) => {
    try {
        //get course and user id
        const {allCourses} = req.body;
        const userId = req.user.id;

        //validate and add total amount for every courses 
        let totalAmount = 0;
        let validatedCourses = []
        for(const courseId of allCourses){
            let courseDetails
            try {
                //validation
                courseDetails = await CourseModel.findById(courseId) 
                if(!courseDetails){
                    return res.status(401).json({
                        success: false,
                        message: "Could not find the course"
                    })
                }
                //valid courseDetails
                //check user already purchased or enrolled in the same course
                const uid =  new mongoose.Types.ObjectId(String(userId));
                if(courseDetails.studentsEnrolled.includes(uid)){
                    return res.status(401).json({
                        success: false,
                        message: "Student is already Enrolled"
                    })
                }

                //add price to total amount if everything works
                totalAmount += courseDetails.price;
                validatedCourses.push(courseDetails._id)
            } catch (error) {
                return res.status(401).json({
                    success: false,
                    message: "error in adding price for this course",
                    courseDetails,
                    error: error.message,
                })
            }
        }
        //create razorPay order
        const amount = totalAmount;
        const currency = "INR";
        const options = {
            amount: amount*100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                validatedCourses: JSON.stringify(validatedCourses),
                userId: String(userId)
            }   
        }
        try {
            //initiate payment using razorpay
            const paymentResponse = await razorpayConnect.orders.create(options);
            console.log(paymentResponse)
            return res.status(200).json({
                success: true,
                validatedCourses: validatedCourses,
                orderId : paymentResponse.id,
                currency: paymentResponse.currency,
                amount : paymentResponse.amount,
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "could not initiate order"
            })     
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something Went wrong while capturing Payment, Please Try Again",
            error: error.message
        })      
    }

}

//verify Signature of Razorpay and Server Webhook Method
const verifySignature = async (req,res) => {
    const razorpaySignature = req.headers["x-razorpay-signature"]

    if (!razorpaySignature){
        return res.status(200).json({
            success: false, 
            message: "Signature not found"
        })
    }

    const expected_signature = crypto.createHmac("sha256",process.env.RAZORPAY_WEBHOOK_SECRET).update(JSON.stringify(req.body)).digest("hex");

    if(expected_signature === razorpaySignature){
        // Ignore unwanted events
        if (req.body.event !== "payment.captured") {
            return res.status(200).json({
                 success: true,
                 message: "Event skipped as Payment not captured" 
            });
        }
        
        //enroll student in course
        const paymentData = req.body.payload.payment.entity

        const validatedCourses = JSON.parse(paymentData.notes.validatedCourses);
        const userId = paymentData.notes.userId;

        //enroll student 
        for(const courseId of validatedCourses){
            //add user in course
            const enrolledCourse = await CourseModel.findByIdAndUpdate(courseId,
                {$push:{studentsEnrolled:userId}},
                {new:true}
            )
            if(!enrolledCourse){
                //we cant return response inside loop 
                continue
            }
            //create course Progress
            const courseProgress = await courseProgressModel.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            })

            //add course and progress in user
            const studentEnrolled = await UserModel.findByIdAndUpdate(userId,
                {$push:{courses:courseId, courseProgress:courseProgress._id}},
                {new: true}
            )

            if(studentEnrolled){
                //send confirmation mail 
                const currMailTemplate = mailTemplate(studentEnrolled.firstName,enrolledCourse.courseName);
                const mailResponse = mailSender(studentEnrolled.email,"Course Enrollment Successfull",currMailTemplate);
            }

        }
        return res.status(200).json({
            success: true,
            message: "Payment verified and Confirmation mail sent Successfully"
        })
    }
    else{
        return res.status(200).json({
            success: false,
            message: "Signature not verified"
        })
    }
}

module.exports = {capturePayment,verifySignature}

