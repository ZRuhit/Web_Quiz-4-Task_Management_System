import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const app= express();
const port=3000;
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.get("/",(req,res)=>{
    res.json({message: "Welcome to the server"});
});

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`);
})


mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("MongoDB connected successfully");
})
.catch((error)=>{
    console.error(error);
    
})