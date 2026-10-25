const CategoryModel = require("../models/Category")
const CourseModel = require("../models/Course")

//create Category
const createCategory = async (req,res) => {
    try {
        //get name and description
        const {name,description} = req.body
        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "All feilds are required "
            })
        }
        //create entry in db
        const CategoryDetails = await CategoryModel.create({
            name: name,
            description: description,
        })
        console.log(CategoryDetails)        
        return res.status(200).json({
            success: true,
            message: "Category created successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating Category, Please try again",
            error: error.message
        })
    }
}

//get all Category
const showAllCategory = async (req,res) => {    
    try {
        const allCategory = await CategoryModel.find({},{name: true,description: true});
        return res.status(200).json({
            success: true,
            message: "All Category returns successfully",
            allCategory,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
} 

const categoryPageDetails = async (req,res) =>{
    try {
        //Get courses for specified category
        const {categoryId} = req.params;
        const selectedCategory = await CategoryModel.findById(categoryId).populate({
            path:"courses",
            match:{status: "Published"},
            populate:[
                {path: "instructor",},
                {path: "ratingAndReviews"}
            ]
        }).exec()

        //handle case when category is not found
        if(!selectedCategory){
            return res.status(401).json({
                success: false,
                message: "Category not found"
            })
        }
        const selectedCourses = selectedCategory.courses
        //Get courses for other categories
        const categoryExceptSelected = await CategoryModel.find({_id:{$ne:categoryId }}).populate({
            path:"courses",
            match:{status:"Published"},
            populate:[
                {path: "instructor",},
                {path: "ratingAndReviews"}
            ]
        }).exec();
        let differentCourses = [];
        for(const category of categoryExceptSelected){
            differentCourses.push(...category.courses);
        }

        //Get top Selling courses across all categories
        const mostSellingCourses = await CourseModel.find({status:"Published"}).sort({ studentsEnrolled: -1 }).limit(10).populate("instructor ratingAndReviews")
        //return response
        return res.status(200).json({
            success: true,
            categoryName: selectedCategory.name,
            categoryDescription: selectedCategory.description,
            selectedCourses: selectedCourses,
            differentCourses: differentCourses,
            mostSellingCourses: mostSellingCourses
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while loading CategoryPage Details",
            error: error.message
        })
    }
}
module.exports = {createCategory,showAllCategory,categoryPageDetails}