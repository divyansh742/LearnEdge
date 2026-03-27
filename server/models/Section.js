const {Schema,model} = require("mongoose")

const sectionSchema = new Schema({
    sectionName: {
        type: String,
    },
    subSection:[
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "SubSection",
        }
    ],
    course:{
        type: Schema.Types.ObjectId,
        ref: "courses"
    }
})

const sectionModel = model("Section", sectionSchema)
module.exports = sectionModel