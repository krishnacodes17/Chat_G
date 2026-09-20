const mongoose = require("mongoose")

const connectToDB = async ()=>{
    try {
        const db  =await mongoose.connect(process.env.MONGODB_URI)
        console.log("MongoDB connected succcessfully")

    } catch (error) {
        console.log("error on connected to db :" , error)
    }
}

module.exports = connectToDB