const {Schema,model} = require("mongoose")

const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required : true,
            trim : true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        password:{
            type: String,
            required: true,
            select: false,
        },
        accountType:{
            type: String,
            enum:["Admin","Student","Instructor"],
            required: true,
        },
        additionalDetails:{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Profile",
        },
        courses:[
            {
                type: Schema.Types.ObjectId,
                ref: "Course"
            }
        ],
        image:{
            type:String,
            required: true,
        },
        token:{
            type: String,
        },
        resetPasswordExpires:{
            type: Date,
        },
        courseProgress: [
            {
                type : Schema.Types.ObjectId,
                ref: "CourseProgress"
            }
        ],
    }
)
const UserModel = model("User",UserSchema)
module.exports = UserModel