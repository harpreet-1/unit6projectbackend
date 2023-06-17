const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  pricing: { type: Number },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professional",
    required: true,
  },
  image: String,
});

const ServiceModel = mongoose.model("Service", serviceSchema);

module.exports = ServiceModel;
