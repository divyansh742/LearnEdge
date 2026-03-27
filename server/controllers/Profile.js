const UserModel = require("../models/User")
const ProfileModel = require("../models/Profile")
const courseProgressModel = require("../models/CourseProgress")
const CourseModel = require("../models/Course")
const uploadImageCloudinary = require("../utils/imageUploader")
const convertSecondsToDuration = require("../utils/secToDuration")
const ratingAndReviewModel = require("../models/RatingAndReview")

const updateProfile = async (req,res) => {
    try {

        //get data
        const {firstName, lastName , dateOfBirth, about , contactNumber , gender} = req.body
        const userId = req.user.id
        //find user
        const userDetails = await UserModel.findById(userId)
        //find profile
        const profileId = userDetails.additionalDetails
        const profileDetails = await ProfileModel.findById(profileId)

        //update user 
        if(firstName) userDetails.firstName = firstName
        if(lastName) userDetails.lastName = lastName
        //update profile image for new name if it is deafault dicebear
        const isDefaultDicebear = userDetails.image.includes("api.dicebear.com");
        if(isDefaultDicebear && ( firstName || lastName)) 
            userDetails.image = `http://api.dicebear.com/5.x/initials/svg?seed=${userDetails.firstName}%20${userDetails.lastName}`
        await userDetails.save()

        //update profile
        if(contactNumber) profileDetails.contactNumber = contactNumber
        if(gender) profileDetails.gender = gender
        if(dateOfBirth) profileDetails.dateOfBirth = dateOfBirth
        if(about) profileDetails.about = about
        await profileDetails.save()

        //updated user details
        const updateUserDetails = await UserModel.findById(userId).populate("additionalDetails").exec()
        //return response
        return res.status(200).json({
            success: false,
            message: "Profile Updated Successfully",
            updateUserDetails,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating Profile, Please try Again",
            error: error.message
        })
        
    }
}
//delete Account
const deleteAccount = async (req,res) => {
    try {
        //get id
        const userId = req.user.id;
        //validation
        const userDetails = await UserModel.findById(userId)
        //validation
        if(!userDetails){
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        //if user is Instructor request manual deletion by Admin
        if(userDetails.accountType === "Instructor"){
            return res.status(200).json({
                success: false,
                message: "Instructor Account is deleted by Manual deletion request to Admin"
            })
        }


        //delete profile
        await ProfileModel.findByIdAndDelete(userDetails.additionalDetails)

        //remove user from studentEnrolled of all courses taken by the user
        await CourseModel.updateMany(
            { _id: { $in: userDetails.courses } },
            { $pull: { studentsEnrolled: userId } }
        );
        //delete course Progress of each course taken by this user
        await courseProgressModel.deleteMany({userId: userId})

        //keep all reviews by this user just change user : null
        await ratingAndReviewModel.updateMany({user: userId},{user: null})

        //delete user
        await UserModel.findByIdAndDelete(userId)
        //return response
        return res.status(200).json({
            success: true,
            message: "Account Deleted Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while deleting account/Profile, Please try Again",
            error: error.message
        })
        
    }
}
const updateDisplayPicture = async (req,res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id;
        //upload image to cloudinary
        const uploadResponse = await uploadImageCloudinary(displayPicture,process.env.FOLDER_NAME,1000,1000);
        const updatedProfile = await UserModel.findByIdAndUpdate(userId,
            {image: uploadResponse.secure_url},
            {new: true}
        )
        //return response
        return res.status(200).json({
            success: true,
            message: "Display Picture Updated Successfully",
            updatedProfile,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating display picture",
            error: error.message
        })
        
    }
    
}

//get full user details
const getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id
    const userDetails = await UserModel.findById(userId).populate("additionalDetails").exec()
    userDetails.password = undefined
    return res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while, fetching user details",
      error: error.message,
    })
  }
}

//get enrolled courses
const getEnrolledCourses = async (req,res) => {
    try {
        const userId = req.user.id;
        //get user details
        const userDetails = await UserModel.findById(userId).populate({
            path:"courses",
            select:"courseName courseDescription courseContent thumbnail",
            populate:{
                path: "courseContent",
                select: "subSection",
                populate:{
                    path: "subSection",
                    select: "timeDuration"
                }
            }
        }).lean() //use lean for read only operations .save() wont work
        
        //validation
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: "Could not find user details",
            })
        }
        if (!userDetails.courses?.length) {
            return res.status(200).json({
                success: true,
                message: "User has no enrolled courses",
                allCourses: [],
            });
        }

        const allProgressDetails = await courseProgressModel.find({userId})

        //add totalduration and progressPercentage in courseObject
        const allCourses = userDetails.courses.map((course) =>{
                //find total duration total no of videos in each course 
                let totalDuration = 0;
                let totalVideosLength = 0;
                course.courseContent.forEach(section =>{
                    totalVideosLength += section.subSection.length;
                    section.subSection.forEach(video =>{
                        totalDuration += parseInt(video.timeDuration)
                    })
                })  

                let courseProgress = allProgressDetails.find(progress => progress.courseId.toString() === course._id.toString())
                let completedVideosLength = courseProgress?.completedVideos?.length || 0;
                //add progress percentage and duration for each course
                let progressPercentage = totalVideosLength === 0 ? 0 : Math.round((completedVideosLength/totalVideosLength) * 100);
                let duration = convertSecondsToDuration(totalDuration)

                //add these into courses
                return {
                    _id: course._id,
                    courseName: course.courseName,
                    courseDescription: course.courseDescription,
                    thumbnail: course.thumbnail,
                    duration: duration,
                    progressPercentage: progressPercentage,
                }
            })
        return res.status(200).json({
            success: true,
            message: "Fetched Enrolled courses successfully",
            allCourses,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong getting user enrolled courses dashboard",
            error: error.message
        })
    }
}

//instructor dashboard
const instructorDashboard = async (req,res) => {
    try {
        const instructorId = req.user.id
        const courseDetails = await CourseModel.find({instructor: instructorId})
        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            //create new object with additional details
            const courseDataWithStats = {
                _id : course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                //include new properties
                totalStudentsEnrolled,
                totalAmountGenerated,
            }
            return courseDataWithStats
        })
        return res.status(200).json({
            success: true,
            message: "Fetched instructor data successfully",
            courses: courseData,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong while getting instructor dashboard",
            error: error.message,
        })
    }
}
module.exports = {updateProfile,deleteAccount,updateDisplayPicture,getAllUserDetails,instructorDashboard,getEnrolledCourses}