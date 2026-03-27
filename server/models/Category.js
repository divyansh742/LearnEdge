const {Schema, model} = require("mongoose")

const CategorySchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    courses:[{
        type: Schema.Types.ObjectId,
        ref : "Course",
    }]
})

const CategoryModel = model("Category",CategorySchema)
module.exports = CategoryModel