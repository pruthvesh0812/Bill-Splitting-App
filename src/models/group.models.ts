import mongoose from "mongoose"

const groupSchema = new mongoose.Schema({
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users",
            
        }
    ],
  groupName:{
    type:String,
    required:true
  }  ,
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    }
})

export const Groups = mongoose.model("Groups",groupSchema)
