const {Schema,model} = require("mongoose")

const ratingAndReviewsSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    course:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    } 
})

const ratingAndReviewModel = model("RatingAndReview",ratingAndReviewsSchema)
module.exports = ratingAndReviewModel