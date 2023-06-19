const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOtp, generateOtp } = require("../Middlewares/sendotp");
const BlacklistModel = require("../Models/blacklist");
const BeautyProfessionalModel = require("../Models/beautyProfessional");
const professionalAuth = require("../Middlewares/professionalAuth");
require("dotenv").config();
const professionalRouter = express.Router();

//-------------------------- Register New beautyProfessional -----------------------------------

professionalRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await BeautyProfessionalModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already registered Please Login" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    req.body.password = hashedPassword;
    const newUser = new BeautyProfessionalModel(req.body);

    const otp = generateOtp();
    newUser.otp = otp;
    const savedUser = await newUser.save();
    // sendOtp(name, email, otp);
    return res.status(201).json({
      message:
        "beautyProfessional registered successfully. Please check your email for the OTP.",
    });
  } catch (error) {
    console.error("Error registering beautyProfessional:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

professionalRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const beautyProfessional = await BeautyProfessionalModel.findOne({ email });
    if (!beautyProfessional) {
      return res.status(404).json({ message: "beautyProfessional not found" });
    }
    // const otp = generateOtp();
    // if (!beautyProfessional.emailVerified) {
    //   sendOtp(beautyProfessional.name, email, otp);
    //   beautyProfessional.otp = otp;
    //   await beautyProfessional.save();
    //   return res.status(201).json({
    //     message: "Please check your email for the OTP  for Email verification.",
    //   });
    // }

    const isPasswordValid = await bcrypt.compare(
      password,
      beautyProfessional.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { beautyProfessionalId: beautyProfessional._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });

    res.json({ token, beautyProfessional });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

professionalRouter.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const beautyProfessional = await BeautyProfessionalModel.findOne({ email });

    if (!beautyProfessional || beautyProfessional.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    beautyProfessional.emailVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Auth for all route ---------------------

professionalRouter.use(professionalAuth);

// ------------------------- beautyProfessional  profile  --------------------------

professionalRouter.get("/profile/", async (req, res) => {
  try {
    const beautyProfessionalId = req.professionalID;
    const beautyProfessional = await BeautyProfessionalModel.findById(
      beautyProfessionalId
    );

    if (!beautyProfessional) {
      return res.status(404).json({ message: "beautyProfessional not found" });
    }
    return res.status(200).json({ beautyProfessional });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
//------------------- Update beautyProfessional Profile---------------------
professionalRouter.patch("/profile", async (req, res) => {
  try {
    const beautyProfessionalId = req.beautyProfessional._id;

    const updates = req.body;

    const beautyProfessional = await BeautyProfessionalModel.findByIdAndUpdate(
      beautyProfessionalId,
      updates,
      {
        new: true,
      }
    );

    if (!beautyProfessional) {
      return res.status(404).json({ error: "beautyProfessional not found" });
    }

    res.json(beautyProfessional);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to update beautyProfessional profile" });
  }
});

// ---------------Change Password-------------------
professionalRouter.patch("/changePassword", async (req, res) => {
  try {
    const beautyProfessionalId = req.beautyProfessional._id;

    const { currentPassword, newPassword } = req.body;

    const beautyProfessional = await BeautyProfessionalModel.findById(
      beautyProfessionalId
    );

    if (!beautyProfessional) {
      return res.status(404).json({ error: "beautyProfessional not found" });
    }
    const isMatch = await bcrypt.compare(
      currentPassword,
      beautyProfessional.password
    );

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 5);

    beautyProfessional.password = hashedPassword;
    await beautyProfessional.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to change password" });
  }
});

// -------------Forgot Password ----with OTP------------------------
professionalRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const beautyProfessional = await BeautyProfessionalModel.findOne({ email });

    if (!beautyProfessional) {
      return res.status(404).json({ error: "beautyProfessional not found" });
    }

    await sendOtp(beautyProfessional.email, otp);

    beautyProfessional.otp = otp;
    await beautyProfessional.save();

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: "Failed to initiate password reset" });
  }
});

//---------------- Reset Password-------- Verify OTP and Update Password---------------------
professionalRouter.patch("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const beautyProfessional = await BeautyProfessionalModel.findOne({ email });

    if (!beautyProfessional) {
      return res.status(404).json({ error: "beautyProfessional not found" });
    }

    if (beautyProfessional.resetOtp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 5);

    beautyProfessional.password = hashedPassword;
    beautyProfessional.otp = null;
    await beautyProfessional.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// -------------------single beautyProfessional details-------------

professionalRouter.get("/single/:id", async (req, res) => {
  try {
    const beautyProfessionalId = req.params.id;

    const beautyProfessional = await BeautyProfessionalModel.findById(
      beautyProfessionalId
    );

    if (!beautyProfessional) {
      return res.status(404).json({ message: "beautyProfessional not found" });
    }

    res.json(beautyProfessional);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// -----------delete beautyProfessional---------------------
professionalRouter.delete("/:id", async (req, res) => {
  try {
    const beautyProfessionalId = req.params.id;
    const deletedUser = await beautyProfessional.findByIdAndDelete(
      beautyProfessionalId
    );

    if (!deletedUser) {
      return res.status(404).json({ message: "beautyProfessional not found" });
    }

    res.json({ message: "beautyProfessional deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// -----------------logout beautyProfessional  by  blacklisting------------------

professionalRouter.post("/logout", async (req, res) => {
  const { token } = req.body;

  const newBlacklistedToken = new BlacklistModel({ token });
  await newBlacklistedToken.save();

  res.json({ message: "Token revoked successfully" });
});

// -----------------------get all beautyProfessionals ----------------------------
professionalRouter.get("/data", async (req, res) => {
  try {
    const beautyProfessionals = await BeautyProfessionalModel.find();

    res.json(beautyProfessionals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});
module.exports = professionalRouter;
