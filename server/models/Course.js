const {Schema, model} = require("mongoose")

const courseSchema = new Schema({
    courseName:{
        type: String,
        required: true,
        trim : true,
    },
    courseDescription:{
        type: String,
    },
    instructor:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatYouWillLearn: {
        type: String,
    },
    courseContent: [
        {
            type: Schema.Types.ObjectId,
            ref: "Section",
        }
    ],
    ratingAndReviews:[
        {
            type: Schema.Types.ObjectId,
            ref: "RatingAndReview"
        }
    ],
    price:{
        type: Number,
    },
    thumbnail:{
        type: String,  
    },
    Category:{
        type: Schema.Types.ObjectId,
        ref: "Category",
    },
    tags:{
        type: [String],
    },
    studentsEnrolled:[
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        }
    ],
    instructions:{
        type: [String]
    },
    status:{
        type: String,
        enum: ["Draft","Published"]
    }

})

const   CourseModel = model("Course", courseSchema)
module.exports = CourseModel