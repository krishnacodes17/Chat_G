const express = require("express")
const { registerUserController, loginUserController, logoutUserController } = require("../controllers/auth.Controller")

const authRouter = express.Router()


authRouter.post("/register", registerUserController)
authRouter.post("/login", loginUserController)
authRouter.post("/logout",logoutUserController)




module.exports = authRouter 