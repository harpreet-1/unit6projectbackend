const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendOtp, generateOtp } = require("../Middlewares/sendotp");
const UserModel = require("../Models/user");
const BlacklistModel = require("../Models/blacklist");
const userAuth = require("../Middlewares/userAuth");
require("dotenv").config();
const userRouter = express.Router();

//-------------------------- Register New User -----------------------------------

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const otp = generateOtp();
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      // Checking  email  verified or not--------------

      return res
        .status(400)
        .json({ message: "Email already registered Please Login" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      otp,
      emailVerified: false,
    });

    const savedUser = await newUser.save();
    sendOtp(name, email, otp);
    return res.status(201).json({
      message:
        "User registered successfully. Please check your email for the OTP.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.emailVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // const otp = generateOtp();
    // if (!user.emailVerified) {
    //   sendOtp(user.name, email, otp);
    //   user.otp = otp;
    //   await user.save();
    //   return res.status(201).json({
    //     message: "Please check your email for the OTP  for Email verification.",
    //   });
    // }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      httpOnly: true,
    });

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
});

// --------------------authorization---------------------------
userRouter.use(userAuth);
// ---------------------------user profile--------------------------
userRouter.get("/profile/", async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
//------------------- Update User Profile---------------------
userRouter.patch("/profile", async (req, res) => {
  try {
    const userId = req.user._id;

    const updates = req.body;

    const user = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Failed to update user profile" });
  }
});

// ---------------Change Password-------------------
userRouter.patch("/changePassword", async (req, res) => {
  try {
    const userId = req.user._id;

    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 5);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to change password" });
  }
});

// -------------Forgot Password ----with OTP------------------------
userRouter.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await sendOtp(user.email, otp);

    user.otp = otp;
    await user.save();

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: "Failed to initiate password reset" });
  }
});

//---------------- Reset Password-------- Verify OTP and Update Password---------------------
userRouter.patch("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 5);

    user.password = hashedPassword;
    user.otp = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// -------------------single user details-------------

userRouter.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// -----------delete user---------------------
userRouter.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// -----------------logout user  by  blacklisting------------------

userRouter.post("/logout", async (req, res) => {
  res.clearCookie("token");
  const { token } = req.body;
  res.clearCookie("token");

  const newBlacklistedToken = new BlacklistModel({ token });
  await newBlacklistedToken.save();

  res.json({ message: "Token revoked successfully" });
});

// -----------------------get all users ----------------------------
userRouter.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = { userRouter };
