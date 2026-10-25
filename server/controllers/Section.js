const SectionModel = require("../models/Section")
const CourseModel = require("../models/Course")
const subSectionModel = require("../models/SubSection")
const sectionModel = require("../models/Section")


const createSection = async (req,res) => {
    try {
        //data fetch 
        const {sectionName,courseId} = req.body
        const  instructorId = req.user.id;
        //data validation
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message: "All field are required"
            })
        }

        //check instructor and course
        const CourseDetails = await CourseModel.findOne(
            {_id: courseId, instructor: instructorId}
        )
        if(!CourseDetails){
            return res.status(401).json({
                success: false,
                message: "Course with this Instructor was not found",
            })
        }
        //create section
        const newSection = await SectionModel.create({sectionName,course: courseId})
        //update course with section ObjectId
        const updatedCourseDetails = await CourseModel.findByIdAndUpdate(courseId,
            {
                $push:{
                    courseContent: newSection._id,
                }
            },
            {new: true}
        ).populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            }
        }).exec()
        //return response
        return res.status(200).json({
            success: true,
            message: "Section Created Successully",
            newSection,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create Section , Please try Again",
            error: error.message,
        })
    }
}
const updateSection = async (req,res) => {
    try {
        //get section name
        const {newSectionName,sectionId,courseId} = req.body
        const instructorId = req.user.id;
        //validation
        if(!newSectionName){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }
        //check instructor and course
        const CourseDetails = await CourseModel.findOne(
            {_id: courseId, instructor: instructorId}
        )
        if(!CourseDetails){
            return res.status(401).json({
                success: false,
                message: "Course with this Instructor was not found",
            })
        }
        
        //fetch and update data
        const updatedSection = await SectionModel.findByIdAndUpdate(sectionId,
            {sectionName:newSectionName},
            {new: true},
        )
        return res.status(200).json({
            success: true,
            message: "Section updated Successfully",
            updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Something went wrong while Updating Section, Please try Again",
            error: error.message
        })
        
    }
}
const deleteSection = async (req,res) =>{
    try {
        //find section id
        const {sectionId,courseId} = req.body;
        const instructorId = req.user.id;
        //validation
        if(!sectionId){
            return res.status(401).json({
                success: false,
                message: "All field are required"
            })
        }
        //check instructor and course
        const CourseDetails = await CourseModel.findOne(
            {_id: courseId, instructor: instructorId}
        )
        if(!CourseDetails){
            return res.status(401).json({
                success: false,
                message: "Course with this Instructor was not found",
            })
        }
        //find by id and 
        const deletedSection = await SectionModel.findById(sectionId)
        //also delete from course reference
        await CourseModel.findByIdAndUpdate(courseId,
            {
                $pull:{
                    courseContent: sectionId
                }
            }
        )
        //remove all subsections
        const subsections = deleteSection?.subSection || []; 
        for(const subSectionId of subsections){
            await subSectionModel.findByIdAndDelete(subSectionId)
        }
        //delete section
        await sectionModel.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully",
            deletedSection,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the Section , Please try again",
            error: error.message
        })
    }
}
module.exports = {createSection,updateSection,deleteSection}