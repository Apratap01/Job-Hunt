import cookieParser from 'cookie-parser';
import express from 'express'
import cors from "cors"
const app = express();
import userRoute from "./Routes/user.routes.js"



app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"Hello",
        success:true
    })
})

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOptions = {
    origin:process.env.CORS_ORIGIN,
    credentials: true
}
app.use(cors(corsOptions))

app.use("/api/v1/user",userRoute)

export {app}
