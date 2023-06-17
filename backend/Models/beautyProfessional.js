const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  bussinessName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },

  ratings: [
    {
      userId: { type: String },
      rating: {
        type: Number,
      },
    },
  ],
  portfolio: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      imageUrl: {
        type: String,
      },
    },
  ],
});

const BeautyProfessionalModel = mongoose.model(
  "BeautyProfessional",
  professionalSchema
);

module.exports = BeautyProfessionalModel;
