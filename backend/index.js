import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from './utils/db.js';


dotenv.config({
    path: "./.env"
})

connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000,()=>{
    console.log(`server running at port ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Failed to connect to the database::",error);
});