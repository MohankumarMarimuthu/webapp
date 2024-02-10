import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes.js"
import authRouter from "./routes/authRoutes.js" // always add with js 
import listRouter from "./routes/listRoutes.js"
import cookieParser from "cookie-parser";
import path from "path";
dotenv.config()

const app = express();
app.use(express.json());   
app.use(cookieParser());


mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mernestate-v2.2dw54b5.mongodb.net/?retryWrites=true&w=majority`).then(() => {
  console.log("database connected")
  app.listen(3000 , () => {
    console.log("server started and listening to the port 3000!!")
})
}).catch(error => console.log('errr' , error))

const __dirname = path.resolve();


app.use("/api/user" , userRouter)
app.use("/api/auth" , authRouter)
app.use("/api/list" , listRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*' , (req, res) => {
  res.sendFile(path.join(__dirname, 'client' , 'dist' , 'index.html'));
})


// it is middleware
app.use((err, req, res, next) => { // always need to pass request first before response
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})