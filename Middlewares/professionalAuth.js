const jwt = require("jsonwebtoken");

const BlacklistModel = require("../Models/blacklist");
const BeautyProfessionalModel = require("../Models/beautyProfessional");
const { json } = require("express");
require("dotenv").config();
const professionalAuth = async (req, res, next) => {
  try {
    // const token =
    //   req.cookies.token || req.headers.Authorization.split(" ")[1] || req.query.token;
    const token = req.headers.Authorization.split(" ")[1];
    return res.json({ token });
    const isblacklisted = await BlacklistModel.findOne({ token });

    if (isblacklisted) {
      return res.status(400).json({ message: "Invalid Token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const professional = await BeautyProfessionalModel.findById(
      decoded.beautyProfessionalId
    );

    if (!professional) {
      return res.status(401).json({ error: "Professinoal not found" });
    }

    req.professionalID = professional._id;

    next();
  } catch (error) {
    res.status(401).json({ error: error });
  }
};

module.exports = professionalAuth;

// console.log(process.env.JWT_SECRET_KEY);
