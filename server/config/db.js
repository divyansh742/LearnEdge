const mongoose = require("mongoose")

const connectDB = async () =>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log("MongoDB Connected")
    }catch(error){
        console.error(error.message)
        throw error;
    }
}
module.exports = connectDB