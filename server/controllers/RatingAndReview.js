const ratingAndReviewModel = require("../models/RatingAndReview")
const CourseModel = require("../models/Course")
const { default: mongoose } = require("mongoose")


//createRating

const createRatingReview = async (req,res) => {
    try {
        //get rating review userId and CourseID
        const {rating, review, courseId} = req.body
        const userId = req.user.id
        //validation 
        if(!courseId){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        //check if user is enrolled or not
        const courseDetails = await CourseModel.findOne({
            _id: courseId,
            studentsEnrolled: { $in: [userId]}
        });
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in this course"
            })
        }
        //check if user already have a rating Review on this course
        const alreadyReview = await ratingAndReviewModel.findOne({
            user: userId,
            course: courseId,
        })
        let ratingAndReview;
        if(alreadyReview){
            ratingAndReview = await ratingAndReviewModel.findByIdAndUpdate(
                alreadyReview._id,
                {rating,review},
                {new:true}
            )
        }
        else{
            console.log("new review")
            //create rating and review
            ratingAndReview = await ratingAndReviewModel.create({
                rating,
                review,
                user: userId,
                course: courseId,
            })
            //update course with this ratingReview
            const updatedCourseDetails = await CourseModel.findByIdAndUpdate(courseId,
                {$addToSet:{ratingAndReviews: ratingAndReview._id}},
                {new: true}
            )
        }
        const updatedCourse = await CourseModel.findById(courseId).populate({
            path: "instructor",
            populate:{
                path:"additionalDetails"

            }
        }).populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate:{
                path:"subSection",
            }
        }).exec()
        //return response
        return res.status(200).json({
            success: true,
            message: alreadyReview ? "Review updated": "Review added",
            ratingAndReview,
            updatedCourse
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while adding rating review",
            error: error.message
        })
    }
}
//getAverageRating

const getAverageRating = async (req,res) => {
    try {
        //get course id
        const courseId = req.body.courseId
        //validation
        if(!courseId){
            return res.status(400).json({
                success : false,
                message: "All fields are required"
            })
        }
        //calculate avg rating
        const result = await ratingAndReviewModel.aggregate([
            {
                $match:{course: new mongoose.Types.ObjectId(courseId) }
                //casting objId cause aggregate bypass auto casting in mongoose
            },
            {
                $group:{
                    _id: null,
                    averageRating: {$avg: "$rating"}
                }
            }
        ])
        //if no rating return 0 avg or calculated one
        const averageRating = (result.length > 0) ? result[0].averageRating : 0;
        //return response
        return res.status(200).json({
            success: true,
            averageRating,
            message: "Calculated average Rating successfully"
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting avg rating",
            error: error.message
        })
    }
}

//getAllRating
const getAllRatingReview = async (req,res) => {
    try {
        //get all rating and review
        const allRatingAndReview = await ratingAndReviewModel.find({}).sort({rating:"desc"}).populate({
            path:"user",
            select: "firstName lastname email image",
        }).populate({
            path: "course",
            select: "courseName"
        }).limit(30).exec()
        //return response
        return res.status(200).json({
            success: true,
            message: "All rating and review fetched Successfully",
            allRatingAndReview,
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting all rating and review",
            error: error.message
        })
    }
}

//find all rating review of a course
const getCourseRatingReview = async (req,res) => {
    try {
        //get course id
        const {courseId} = req.body;

        //validation
        if(!courseId){
            return res.status(400).json({
                success : false,
                message: "All fields are required"
            })
        }
        const reviews = await ratingAndReviewModel.find({ course: courseId })
        .populate({
            path: "user",
            select: "firstName lastName email image",
        })
        .sort({rating: "desc"}).exec();

        return res.status(200).json({
            success: true,
            reviews,
            message: "Course rating and review fetched successfully"
        })
            
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting rating and review of this cousre",
            error: error.message
        })
    }
}

module.exports = {createRatingReview,getAverageRating,getAllRatingReview,getCourseRatingReview}

