const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, require: true, default: false },
  role: {
    type: String,
    default: "user",
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
