const {Schema,model} = require("mongoose")

const SubSectionSchema =  new Schema({
    title:{
        type: String,
    },
    timeDuration:{
        type:String,
    },
    description:{
        type:String,
    },
    videoUrl:{
        type: String,
    }
})

const subSectionModel = model("SubSection", SubSectionSchema)
module.exports = subSectionModel
