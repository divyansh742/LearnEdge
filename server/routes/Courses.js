const express = require("express")
const router = express.Router()

//import course controllers
const {createCourse,editCourse,getAllCourses,getCourseDetails,getInstructorCourses,deleteCourse} = require("../controllers/Course")

//import category controllers
const {createCategory,showAllCategory,categoryPageDetails} = require("../controllers/Category")

//import section controllers
const {createSection,updateSection,deleteSection} = require("../controllers/Section")

//import subSection controllers
const {createSubSection,updateSubSection,deleteSubSection} = require("../controllers/SubSection")

//import rating controllers
const {createRatingReview,getAverageRating,getAllRatingReview,getCourseRatingReview} = require("../controllers/RatingAndReview")

//import course progress controllers
const {updateProgress,getProgressPercentage} = require("../controllers/CourseProgress")     

//import middlewares
const {auth,isStudent,isInstructor,isAdmin} = require("../middlewares/middleware")

/******** Course Routes **********/

//course can only be created by instructors
router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/addSection", auth, isInstructor, createSection)
router.put("/updateSection", auth, isInstructor, updateSection)
router.delete("/deleteSection", auth, isInstructor, deleteSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.put("/updateSubSection", auth, isInstructor, updateSubSection)
router.delete("/deleteSubSection", auth, isInstructor, deleteSubSection)

/************* Course Progress ***********/
router.put("/updateProgress", auth, isStudent, updateProgress)
router.get("/getProgressPercentage", auth, isStudent, getProgressPercentage)


//getting courses details
router.get("/getAllCourses" , getAllCourses)
router.get("/getCourseDetails" , getCourseDetails)
router.put("/editCourse", auth, isInstructor, editCourse)
router.get("/getInstructorCourse", auth,  getInstructorCourses)
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)



/****** Category Routes ***********/


//category only created by admins
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories" , showAllCategory)
router.get("/getCategoryPageDetails", categoryPageDetails)


/*********** Rating and review routes ********/
router.post("/createRating", auth, isStudent, createRatingReview)
router.get("/getAverageRatings", getAverageRating)
router.get("/getAllRatingReviews", getAllRatingReview)
router.get("/courseRatingReview", getCourseRatingReview)


module.exports = router




