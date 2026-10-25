const CourseModel = require("../models/Course")
const CategoryModel = require("../models/Category")
const UserModel = require("../models/User")
const uploadImageCloudinary = require("../utils/imageUploader")
const convertSecondsToDuration = require("../utils/secToDuration")
const SectionModel = require("../models/Section")
const subSectionModel = require("../models/SubSection")
const courseProgressModel = require("../models/CourseProgress")
const ratingAndReviewModel = require("../models/RatingAndReview")
const { default: mongoose } = require("mongoose")
const sectionModel = require("../models/Section")

const createCourse = async (req,res) => {
    try {
        //fetch data
        const {courseName, courseDescription,whatYouWillLearn ,price,Category,tags, instructions} = req.body;
        const thumbnail = req.files.thumbnailImage;

         // Convert the tags and instructions from stringified Array to Array
        let tagsArray =  tags ? JSON.parse(tags) : []
        let instructionsArray = instructions ? JSON.parse(instructions) : [];
        //validaton
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !Category || !thumbnail){            
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
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
        const CategoryDetails = await CategoryModel.findById(Category)
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
            price: Number(price),
            tags: tagsArray,
            Category: CategoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: "Draft",
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
        const instructorId = req.user.id;

        //find course details and instructor 
        const courseDetails = await CourseModel.findOne(
            {_id: courseId, instructor: instructorId}
        )
        if(!courseDetails){
            return res.status(401).json({
                success: false,
                message: "Could not found course Details with this instructor",
            })
        }
        //check for thumbnail update
        if(req.files){
            const updatedThumbnail = req.files.thumbnailImage
            const uploadResponse = await uploadImageCloudinary(updatedThumbnail,process.env.FOLDER_NAME)
            courseDetails.thumbnail = uploadResponse.secure_url;
        }
        //update other fields present in req body
        for(const field of Object.keys(updates)){
            if(field === "tags" || field === "instructions"){
                courseDetails[field] = JSON.parse(updates[field])
            }
            else if(field === "Category"){
                //remove course from prev category
                await CategoryModel.findByIdAndUpdate(
                    {_id: courseDetails.Category},
                    {
                        $pull:{
                            courses: courseDetails._id,
                        }
                    },
                    {new: true}
                )
                //add to course to updated category
                await CategoryModel.findByIdAndUpdate(
                    {_id: updates[field]},
                    {
                        $addToSet:{
                            courses: courseDetails._id, 
                        }
                    }

                )
                //add category to course
                courseDetails.Category = updates[field];

            }
            else{
                courseDetails[field] = updates[field]
            }
        }
        await courseDetails.save()
        
        const updatedCourse = await CourseModel.findById(courseId).populate({
            path: "instructor",
            populate:{
                path: "additionalDetails",
            },
        }).populate("ratingAndReviews").populate({
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
        const {courseId} = req.params

        //find course details

        const courseDetails = await CourseModel.findById(courseId).populate({
            path: "instructor",
            populate:{
                path:"additionalDetails"

            }
        })
        .populate("Category")
        .populate({
            path: "ratingAndReviews",
            populate:{
                path:"user",
                select: "firstName lastName email image"
            }
        })
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
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while , getting course Details"
        })
        
    }
}
const getCourseContent = async (req,res) => {
    try {
        const userId = req.user.id;
        const {courseId} = req.params
        const userDetails = await UserModel.findById(userId);
        if(!(userDetails.courses.includes(courseId))){
            return res.status(403).json({
                success: false,
                message: "You are not Enrolled in this course",
            })
        }
        const courseContent = await CourseModel.findById(courseId).populate({
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
        if(!courseContent){
            return res.status(404).json({
                success: false,
                message: "Course not found",
            })
        }
        return res.status(200).json({
            success: true,
            courseContent,
            message: "Course Content Fetched successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Something went wrong while fetching course content",
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
        const coursesDetails = await CourseModel.aggregate([
            { $match:{instructor:new mongoose.Types.ObjectId(instructorId)} },
            { $addFields:{enrollmentCount:{$size:"$studentsEnrolled"}} },
            { $sort:{enrollmentCount:-1} }
        ])
        //populating so we can find duration
        await Promise.all(coursesDetails.map(async (course) => {
            course.courseContent = await sectionModel.find({
                _id: { $in: course.courseContent }
            })
            .populate("subSection")
            .lean()})
        );
        //finding totalDuration
        coursesDetails.forEach((course) => {
            let totalDuration = 0;
            course?.courseContent.forEach((section) => {
                section?.subSection.forEach((subSection) => {
                    totalDuration += Number(subSection?.timeDuration) || 0;
                })
            })
            course.totalDuration = totalDuration;
        })

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
        const instructorId = req.user.id;

        //finding course
        const courseDetails = await CourseModel.findOne(
            {_id: courseId, instructor: instructorId}
        )
        if(!courseDetails){
            return res.status(401).json({
                success: false ,
                message: "Could not found course with this Instructor"
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
        const studentsEnrolled = courseDetails.studentsEnrolled || [];
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
        const courseSections = courseDetails.courseContent || [];
        for(const sectionId of courseSections){
            //delete subsections
            const sectionDetails = await SectionModel.findById(sectionId)
            if(sectionDetails){
                const subSectionDetails = sectionDetails.subSection || []
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
module.exports = {createCourse,editCourse,getAllCourses,getCourseDetails,getInstructorCourses,deleteCourse,getCourseContent}