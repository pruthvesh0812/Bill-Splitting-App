import mongoose from 'mongoose'
import { validatePassword } from './validators'
import bcrypt from 'bcryptjs'
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        unique:true,
        min:[8,"Minimum length should be 8 characters"],
        validate:[validatePassword,"Password invalid"]
    },
    balance:{
        type:Number,
        required:true,
        default:0,
    },
    events:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Events"
        }
    ]
})

// Add a pre-save hook to hash the password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      return next();
    } catch (err) {
      throw new Error("Couldn't save password correctly. Try again")
    //   return next();
    }
  });

export const Users =  mongoose.model("Users",userSchema)