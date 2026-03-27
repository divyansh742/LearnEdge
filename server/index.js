const express = require("express")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

const connectDB = require("./config/db")
const cloudinaryConnect = require("./config/cloudinary")
const fileUpload = require("express-fileupload")

const PORT = process.env.PORT

const cors = require("cors")
const cookieParser = require("cookie-parser")

/******* Routes Import **********/
const contactRoute = require("./routes/Contact")
const courseRoute = require("./routes/Courses")
const paymentRoute = require("./routes/Payment")
const userRoute = require("./routes/User")
const profileRoute = require("./routes/Profile")



connectDB()
cloudinaryConnect();

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin:"http://localhost:3000",
        credentials: true,
    }
))
app.use(fileUpload(
    {
        useTempFiles: true,
        tempFileDir: "/tmp/",
    }
))


//routes
app.use("/api/v1/contactPage", contactRoute)
app.use("/api/v1/auth",userRoute)
app.use("/api/v1/profile", profileRoute)
app.use("/api/v1/course", courseRoute)
app.use("/api/v1/payment", paymentRoute)

//default get route
app.get("/", async (req,res) =>{
    return res.json({
        success: true,
        message: "Your server is up and running..."
    })
})



app.listen(PORT,()=>{
    console.log(`App running on PORT ${PORT}`)
}) 