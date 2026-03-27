const CourseModel = require("../models/Course")
const UserModel = require("../models/User")
const courseProgressModel = require("../models/CourseProgress")
const subSectionModel = require("../models/SubSection")
const { default: mongoose, isValidObjectId } = require("mongoose")

const updateProgress = async (req,res) => {
    try {
        const {courseId,subSectionId} = req.body
        const userId = req.user.id
        const subSectionDetails = await subSectionModel.findById(subSectionId)
        if(!subSectionDetails){
            return res.status(401).json({
                success: false,
                message: "subSection not found ",
            })
        }

        let courseProgressDetails = await courseProgressModel.findOne({
            courseId: courseId,
            userId: userId
        })

        if(!courseProgressDetails){
            return res.status(401).json({
                success: false,
                message: "courseProgress not found ",
            })
        }
        else{
            //if progress of this subsection already present
            if(courseProgressDetails.completedVideos.includes(subSectionId)){
                return res.status(400).json({
                    success: false,
                    message: "Progress of this subsection is already made"
                })
            }
        }
        //add progress
        courseProgressDetails.completedVideos.push(subSectionId)
        await courseProgressDetails.save();

        return res.status(200).json({
            success: true,
            message: "Progress Added Successfully"
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating Course Progress",
            error: error.message
        })
        
    }
}

const getProgressPercentage = async (req,res) =>{
    try {
        const {courseId} = req.body;
        const userId = req.user.id;

        //finding progress details
        const userProgressDetails = await courseProgressModel.findOne({
            courseId,
            userId,
        })
        if(!userProgressDetails){
            return res.status(401).json({
                success: false,
                message: "Progress not found for this course and user",
            })
        }

        //creating course details populating sections and subSections
        const courseDetails = await CourseModel.findById(courseId).populate(
            {
                path: "courseContent",
                populate: {
                    path: "subSection",
                    model: "SubSection",
                }
            }
        )

        let totalVideos = 0;
        courseDetails.courseContent.forEach(section => {
            totalVideos += section.subSection.length;
        })

        const completedVideos = userProgressDetails.completedVideos.length;

        const progressPercentage =  Math.round((completedVideos/totalVideos) * 100); 

        return res.status(200).json({
            success: true,
            message: "Progress percentage found Successfully",
            completed: completedVideos,
            total: totalVideos,
            progress: progressPercentage ? progressPercentage: 0
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting progress Percentage, Please try again later",
            error: error.message
        })
    }
}
module.exports = {updateProgress,getProgressPercentage}