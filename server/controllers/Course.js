const CourseModel = require("../models/Course")
const CategoryModel = require("../models/Category")
const UserModel = require("../models/User")
const uploadImageCloudinary = require("../utils/imageUploader")
const convertSecondsToDuration = require("../utils/secToDuration")
const SectionModel = require("../models/Section")
const subSectionModel = require("../models/SubSection")
const courseProgressModel = require("../models/CourseProgress")
const ratingAndReviewModel = require("../models/RatingAndReview")

const createCourse = async (req,res) => {
    try {
        //fetch data
        const {courseName, courseDescription,whatYouWillLearn ,price,categoryId,tags, status, instructions} = req.body;
        const thumbnail = req.files.thumbnailImage;

         // Convert the tags and instructions from stringified Array to Array
        let tagsArray = JSON.parse(tags)
        let instructionsArray = JSON.parse(instructions)
        //validaton
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !categoryId || !thumbnail || !tagsArray.length || !instructionsArray.length){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        if(!status || status === undefined){
            status = "Draft"
        }
        //check for instructor
        const userId = req.user.id;
        const instructorDeatails = await UserModel.findById(userId,{accountType: "Instructor"})
        if(!instructorDeatails){
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found"

            })
        }
        //check given Category is valid or not
        const CategoryDetails = await CategoryModel.findById(categoryId)
        if(!CategoryDetails){
            return res.status(404).json({
                success: false,
                message: "Category Details not found"

            })
        }
        //upload image to cloudinary
        const thumbnailImage = await uploadImageCloudinary(thumbnail,process.env.FOLDER_NAME)
        //create an entry for new course
        const newCourse = await CourseModel.create({
            courseName,
            courseDescription,
            instructor: instructorDeatails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tags: tagsArray,
            Category: CategoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status,
            instructions: instructionsArray,
        })
        //add new course to instructor schema
        await UserModel.findByIdAndUpdate(
            {_id: instructorDeatails._id },
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new: true}
        )
        //add new course to Category model
        await CategoryModel.findByIdAndUpdate(
            {_id: CategoryDetails._id },
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new: true}
        )
        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating course, Please try again",
            error: error.message
        })
        
    }
}

//edit courses
const editCourse = async (req,res) => {
    try {
        //get data
        const {courseId} = req.body
        const updates = req.body

        //find course details
        const courseDetails = await CourseModel.findById(courseId)
        if(!courseDetails){
            return res.status(401).json({
                success: false,
                message: "Could not found course Details",
            })
        }
        //check for thumbnail update
        if(req.files){
            const updatedThumbnail = req.files.thumbnailImage
            const uploadResponse = await uploadImageCloudinary(updatedThumbnail,process.env.FOLDER_NAME)
            courseDetails.thumbnail = uploadResponse.secure_url;
        }
        //update other fields present in req body
        Object.keys(updates).forEach((field) => {
            if(field === "tags" || field === "instructions"){
                courseDetails[field] = JSON.parse(updates[field])
            }
            else{
                courseDetails[field] = updates[field]
            }
        })
        await courseDetails.save()

        const updatedCourse = await CourseModel.findById(courseId).populate({
            path: "instructor",
            populate:{
                path: "additionalDetails",
            },
        }).populate("Category").populate("ratingAndReviews").populate({
            path: "courseContent",
            populate:{
                path: "subSection",
            },
        }).exec()
        
        return res.status(200).json({
            success: true,
            message: "Course Edited Successfully ",
            updatedCourse,
        })



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while editing or Updating Course , Please try Again later",
            error: error.message,
        })
        
    }
}

//get all courses
const getAllCourses = async  (req,res) => {
    try {
        const allCourses = await CourseModel.find({status: "Published"},{
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            Category: true,
            studentsEnrolled: true,
        }).populate("instructor").exec()
        return res.status(200).json({
            success: true,
            message: "Data for All courses are Fetched Successfully",
            data: allCourses,
        })
    } catch (error) {        
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch courses Data"
        })
    }
}

//get course details

const getCourseDetails = async (req,res) => {

    try {

        //get course id
        const {courseId} = req.body

        //find course details

        const courseDetails = await CourseModel.findById(courseId).populate({
            path: "instructor",
            populate:{
                path:"additionalDetails"

            }
        })
        .populate("Category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate:{
                path:"subSection",
                select: "-videoUrl"
            }
        }).exec()

        if(!courseDetails){
           return res.status(400).json({
                success : false,
                message: `Could not find course with this couseId: ${courseId}`
            })
        }
        //finding course duration
        let totalDuration = 0;
        courseDetails.courseContent.forEach((section) => {
            section.subSection.forEach((subSection) =>{
                const timeDuration = parseInt(subSection.timeDuration)
                totalDuration += timeDuration;
            })
        })
        totalDuration = convertSecondsToDuration(totalDuration);
        //return response
        return res.status(200).json({
            success: true,
            message: "Course Details Fetched Successfully",
            data: courseDetails,
            totalDuration,
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while , getting course Details"
        })
        
    }
}

const getInstructorCourses = async (req,res) => {
    try {
        //get instructor id
        const instructorId = req.user.id;

        //validating
        if(!instructorId){
            return res.status(401).json({
                success: false,
                message: "All field are required"
            })
        }

        //finding courses with this instructor
        const coursesDetails = await CourseModel.find({instructor:instructorId}).sort({createdAt: -1})

        //returning the data
        return res.status(200).json({
            success: true,
            message: "Instructor Courses fetched Successfully",
            coursesDetails,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting instructor courses, Please try Again later",
            error: error.message
        })
        
    }
}


const deleteCourse = async (req,res) => {
    try {
        const {courseId} = req.body

        //finding course
        const courseDetails = await CourseModel.findById(courseId)
        if(!courseDetails){
            return res.status(401).json({
                success: false ,
                message: "Could not found course with these course id"
            })
        }
        //deleting course progress
        const progressDetails = await courseProgressModel.find({courseId});
        //delete course progress from user
        for(const progress of progressDetails){
            await UserModel.findByIdAndUpdate(progress.userId,{
                $pull:{courseProgress: progress._id}
            })
        }
        //delete all progress for this course
        await courseProgressModel.deleteMany({courseId})

        //unenroll student from course
        const studentsEnrolled = courseDetails.studentsEnrolled;
        for(const studentId of studentsEnrolled){
            await UserModel.findByIdAndUpdate(studentId,{
                $pull:{courses: courseId}
            })
        }
        //delete course from instructor
        await UserModel.findByIdAndUpdate(courseDetails.instructor,
            {$pull:{courses:courseId}}
        )
        //delete course from category
        await CategoryModel.findByIdAndUpdate(courseDetails.Category,
            {$pull: {courses:courseId}}
        )
        //delete rating and review for this course
        await ratingAndReviewModel.deleteMany({course: courseId})
        //delete course section and subsection
        const courseSections = courseDetails.courseContent;
        for(const sectionId of courseSections){
            //delete subsections
            const sectionDetails = await SectionModel.findById(sectionId)
            if(sectionDetails){
                const subSectionDetails = sectionDetails.subSection
                for(const subSectionId of subSectionDetails){
                    await subSectionModel.findByIdAndDelete(subSectionId)
                }
                //delete section
                await SectionModel.findByIdAndDelete(sectionId)
            }
        }

        //delete the course
        await CourseModel.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course Deleted Successfully",
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting course",
            error: error.message
        })
        
    }
}
module.exports = {createCourse,editCourse,getAllCourses,getCourseDetails,getInstructorCourses,deleteCourse}