const userModel = require("../models/user.model");

const authMe = async (req, res) => {
//   console.log("userId hai ", req.user._id);
  try {
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data:{
        fullName:user.fullName,
        email:user.email,
        validUser:true
      }
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = authMe;
