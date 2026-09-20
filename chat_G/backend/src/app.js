const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/auth.routes")
const chatRouter = require("./routes/chat.routes")
const authMeRouter = require("./routes/authMe.routes")
const profileRouter = require("./routes/profile.routes")


const app = express()
app.use(express.json())
app.use(cookieParser())


app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}))


app.use("/api/v1/auth", authRouter)
app.use("/api/v1/chat",chatRouter)
app.use("/api/v1/authme",authMeRouter)
app.use("/api/v1/profile",profileRouter)


module.exports = app