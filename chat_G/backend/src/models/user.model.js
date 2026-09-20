const { default: mongoose } = require("mongoose");




const userSchema = new mongoose.Schema({
    fullName:{
        firstName:{
            type:String,
            trim: true
        },
        lastName:{
            type:String,
            trim: true
        }
    },

    email:{
        type:String,
        required:[true,"email is required "],
        trim: true,
        unique:true,
        lowercase: true,
    },

    password:{
        type:String,
        required:[true,"password is required "],
        minlength: [5, "Password must be at least 5 characters"]
    },

    dailyRequestCount:{
        type:Number,
        default: 0
    },

    dailyRequestDate:{
        type:String,
        default: null
    }



},{timestamps:true})


const userModel = mongoose.model("User",userSchema)
module.exports = userModel