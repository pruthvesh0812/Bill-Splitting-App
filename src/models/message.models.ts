import mongoose from 'mongoose'

export const messageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    timestamp:{
        type:String,
        required:true
    },
    sentBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true
    },
    readBy:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }]
})

// in events.models.js, mongoDb document have a size of 16MB so one document will get exhausted - so we need archived messages 

const archivedMessagesSchema = new mongoose.Schema({
    eventId:{
        type:String,
        required:true
    },
    archivedMessages:[messageSchema],
    archivedMessagesBlock:{
        type:Number,
        required:true
    }
})
// so once the size of 16MB is hit in eventSchema for a eventId, we will put that  in archivedMessagesSchema
// its a rare chance but for a event's message to go beyond 16MB - but a chance

export const Messages = mongoose.model("Messages",messageSchema);
export const ArchivedMessages = mongoose.model("ArchivedMessages",archivedMessagesSchema);