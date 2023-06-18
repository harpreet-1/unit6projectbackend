const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  pricing: { type: Number },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BeautyProfessional",
    required: true,
  },
  image: String,
  category: String,
});

const ServiceModel = mongoose.model("Service", serviceSchema);

module.exports = ServiceModel;
