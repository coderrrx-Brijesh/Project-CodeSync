import mongoose from "mongoose";

export const connectDB =async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL!)
        const connection = mongoose.connection
        connection.on("connected",()=>{
            console.log("Connected to DB")
        })
        connection.on("error",(error)=>{
            console.log("Not Connected to DB: ",error)
        })
    }
    catch(error){
        console.log("Not Connected to DB: ",error)
    }
}

