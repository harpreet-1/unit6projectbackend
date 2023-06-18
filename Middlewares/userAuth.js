const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");
const BlacklistModel = require("../Models/blacklist");
require("dotenv").config();
const userAuth = async (req, res, next) => {
  try {
    const token =
      req.headers.Authorization || req.cookies.token || req.query.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const isblacklisted = await BlacklistModel.findOne({ token });

    if (isblacklisted) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    req.userID = decoded.userId;
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication failed" });
  }
};

module.exports = userAuth;
