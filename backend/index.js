import cookieParser from 'cookie-parser';
import express from 'express'
import cors from "cors"

const app = express()


app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"Hello",
        success:true
    })
})

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser)
const corsOptions = {
    origin:'http://localhost:5172',
    credentials: true
}
app.use(cors(corsOptions))


const PORT = 3000
app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`)
})