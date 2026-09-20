const express = require("express")
const authUser = require("../middleware/auth.middeleware")
const getUserProfileController = require("../controllers/profile.controller")
const profileRouter = express.Router()


profileRouter.get("/", authUser , getUserProfileController)


module.exports = profileRouter