const express = require("express")
const authUser = require("../middleware/auth.middeleware")
const authMe = require("../controllers/authMe.controller")
const authMeRouter = express.Router()


authMeRouter.get("/",authUser , authMe)


module.exports = authMeRouter