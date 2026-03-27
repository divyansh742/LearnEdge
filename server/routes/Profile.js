const express = require("express")
const router = express.Router()

const {auth, isInstructor,isStudent} = require("../middlewares/middleware")

const {updateProfile,deleteAccount,updateDisplayPicture,getAllUserDetails,instructorDashboard,getEnrolledCourses} = require("../controllers/Profile")



/*********** Profile Route ********/

router.delete("/deleteAccount" , auth , deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
router.get("/getEnrolledCourses", auth, isStudent, getEnrolledCourses)



module.exports = router

