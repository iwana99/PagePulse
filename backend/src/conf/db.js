import mongoose from 'mongoose'
export const connectDB=async(url)=>{
 
        if(!url){
            throw new Error("Missing url")
        }
        mongoose.set("strictQuery",true)
        await mongoose.connect(url,{
            serverSelectionTimeoutMS: 5000, //MongoDB klijent će najviše 5 sekundi pokušavati da pronađe dostupan MongoDB server.
            maxPoolSize:50  //50 otvorenih konekcija prema MongoDB-u
        })
        console.log("DB connection success ❤❤❤")
   
}