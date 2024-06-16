import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
export const mongoConnect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{dbName:"BillSplitting"})
        console.log("mongoDb connected")
    }
    catch(er){
        console.log("Error while connecting mongoDB",er)
    }
}