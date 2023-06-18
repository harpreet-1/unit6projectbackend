const express = require("express");
const ServiceModel = require("../Models/service");
const BeautyProfessionalModel = require("../Models/beautyProfessional");
const professionalAuth = require("../Middlewares/professionalAuth");
const userAuth = require("../Middlewares/userAuth");
const serviceRouter = express.Router();

// Route: Get services with professional details based on search query

serviceRouter.get("/", async (req, res) => {
  try {
    const { q } = req.query;

    const services = await ServiceModel.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    }).populate("professional");

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// serviceRouter.use(professionalAuth);

// ----------------add a new service---------------------

serviceRouter.post("/add", async (req, res) => {
  try {
    const { name, description, duration, pricing } = req.body;
    const professionalId = req.professionalId;

    const service = new ServiceModel({
      name,
      description,
      duration,
      pricing,
      professional: professionalId,
    });

    const savedService = await service.save();

    res.status(200).json(savedService);
  } catch (error) {
    res.status(500).json({ error: "Failed to add a new service" });
  }
});

// get services for specific professional----------------------

serviceRouter.get("/professional/:professionalId", async (req, res) => {
  const { professionalId } = req.params;

  try {
    const services = await ServiceModel.find({ professional: professionalId });

    res.status(200).json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

module.exports = serviceRouter;
