import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    date: {
        type:Date,
        required:true
    },
    totalAmount:{
        type:Number,
        required:true
    },
    paidByUser:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users",
            required:true
        }
    ],
    status:{
        type:String,
        enum:['OPEN',"CLOSE"],
        required:true
    }
})
export const Events = mongoose.model("Events",eventSchema)

