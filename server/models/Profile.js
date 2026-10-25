const {Schema,model} = require("mongoose")

const ProfileSchema = new Schema({
    gender:{
        type: String,
    },
    dateOfBirth:{
        type: String,
    },
    about:{
        type:String,
        trim: true,
    },
    contactNumber:{
        type: String,
        trim: true,
    }
})

const ProfileModel = model("Profile",ProfileSchema)
module.exports = ProfileModel
