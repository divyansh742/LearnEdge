const subSectionModel = require("../models/SubSection")
const SectionModel = require("../models/Section")
const uploadImageCloudinary = require("../utils/imageUploader")

const createSubSection = async (req,res) => {
    try {
        //fetch data from req body  
        const {sectionId, title,duration,description} = req.body
        //extract video file
        const video = req.files.videoFile
        //validation
        if(!title || !duration || !description || !video){
            return res.status(401).json({
                success: false,
                message: "All field are required"
            })

        }
        //upload video to cloudinary
        const uploadedVideoDetails = await uploadImageCloudinary(video,process.env.FOLDER_NAME)
        //create a subSection
        const subSectionDetails = await subSectionModel.create({
            title: title,
            timeDuration: duration,
            description: description,
            videoUrl: uploadedVideoDetails.secure_url
        })
        //update subSection in section model
        const updatedSection = await SectionModel.findByIdAndUpdate(sectionId,
            {
                $push:{
                    subSection: subSectionDetails._id,
                }
            },
            {new: true}
        ).populate("subSection")
        return res.status(200).json({
            success: true,
            message: "subSection Created Succesfully",
            updatedSection
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something Went wrong , while Creating SubSection , Please try Again",
            error: error.message
        })
        
    }
    
}

//update subSection
const updateSubSection = async (req,res) =>{
    try {
        //fetch data to upload
        const {subSectionId, title,duration,description} = req.body

        //take video if want to update that also
        const video = req.files?.videoFile

        //validation
        if(!subSectionId){
            return res.status(401).json({
                success: false,
                message: "SubSection Id is required"
            })
        }

        //find subSection to update
        const subSectionDetails = await subSectionModel.findById(subSectionId)

        //check validation of SubSection
        if (!subSectionDetails) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        //update details
        if(title) subSectionDetails.title = title
        if(duration) subSectionDetails.duration = duration
        if(description) subSectionDetails.description  = description

        //if video to update
        if(video){
            //upload to cloudinary
            const uploadedVideo = await uploadImageCloudinary(video,process.env.FOLDER_NAME)
            subSectionDetails.videoUrl = uploadedVideo.secure_url
        }

        //update to db
        await subSectionDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: "SubSection Updated Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating subsection , Please try Again",
            error: error.message
        })
    }
}
//delete subSection
const deleteSubSection = async (req,res) => {
    try {
        //get subsection to delete ans its section also 
        const {subSectionId, sectionId} = req.body;

        //remove ref from section i.e. delete the subSection from section
        await SectionModel.findByIdAndUpdate(sectionId,
            {
                $pull:{
                    subSection:subSectionId
                }
            }
        )

        //delete subSection now
        const deletedSubSectionDetails = await subSectionModel.findByIdAndDelete(subSectionId);

        //return response
        return res.status(200).json({
            success: true,
            message: "SubSection Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting subsection , Please try Again",
            error: error.message
        })
    }
}

module.exports = {createSubSection,updateSubSection,deleteSubSection}