import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
    eventName:{
        type:String,
        required:true
    },
    date: {
        type:String,
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
        }
    ],
    status:{
        type:String,
        enum:['OPEN',"CLOSE"],
        required:true
    },
    groupId:{
        type:String,
        required:true
    }
})
export const Events = mongoose.model("Events",eventSchema)

