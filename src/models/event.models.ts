import mongoose from "mongoose"
import { messageSchema } from "./message.models"


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
    },
    messages:[messageSchema], // storing messages of type messageSchema
})


// mongoDb document have a size of 16MB so one document will get exhausted - so we need archived messages 
// defined in message.models.js

export const Events = mongoose.model("Events",eventSchema)

