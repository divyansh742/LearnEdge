const SectionModel = require("../models/Section")
const CourseModel = require("../models/Course")
const subSectionModel = require("../models/SubSection")
const sectionModel = require("../models/Section")


const createSection = async (req,res) => {
    try {
        //data fetch 
        const {sectionName,courseId} = req.body
        //data validation
        if(!sectionName || !courseId){
            return res.status(401).json({
                success: false,
                message: "All field are required"
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
            updatedCourseDetails,
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
        const {newSectionName,sectionId} = req.body
        //validation
        if(!newSectionName){
            return res.status(401).json({
                success: false,
                message: "All fields are required"
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
        const {sectionId} = req.query
        //validation
        if(!sectionId){
            return res.status(401).json({
                success: false,
                message: "All field are required"
            })
        }
        //find by id and 
        const deletedSection = await SectionModel.findById(sectionId)
        //also delete from course reference
        const courseId = deletedSection.course
        await CourseModel.findByIdAndUpdate(courseId,
            {
                $pull:{
                    courseContent: sectionId
                }
            }
        )
        //remove all subsections
        for(const subSectionId of deletedSection.subSection){
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