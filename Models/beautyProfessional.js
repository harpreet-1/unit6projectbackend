const mongoose = require("mongoose");

const professionalSchema = new mongoose.Schema({
  image: String,
  otp: String,
  emailVerified: Boolean,
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
[
  {
    name: "Haircut",
    description: "Classic and modern haircut for all ages",
    duration: 60,
    pricing: 50,
    category: "Hair",
    professional: "648ef184f2052ea3dcb6f204",
    image: "https://example.com/haircut.jpg",
  },
  {
    name: "Hair Coloring",
    description: "Expert hair coloring services using top-quality products",
    duration: 120,
    pricing: 80,
    category: "Hair",
    professional: "648ef2e1f2052ea3dcb6f20b",
    image: "https://example.com/hair-coloring.jpg",
  },
  {
    name: "Highlights",
    description: "Add dimension to your hair with professional highlights",
    duration: 90,
    pricing: 100,
    category: "Hair",
    professional: "648ef3a7f2052ea3dcb6f22b",
    image: "https://example.com/648ef36df2052ea3dcb6f21e.jpg",
  },
  {
    name: "Blowout",
    description: "Get a stunning blowout for a special occasion or night out",
    duration: 45,
    pricing: 40,
    category: "Hair",
    professional: "648ef3e8f2052ea3dcb6f232",
    image: "https://example.com/blowout.jpg",
  },
  {
    name: "Updo",
    description: "Elegant updo hairstyles for weddings and formal events",
    duration: 60,
    pricing: 70,
    category: "Hair",
    professional: "648ef40ef2052ea3dcb6f239",
    image: "https://example.com/updo.jpg",
  },
  {
    name: "Hair Extensions",
    description: "Add length and volume with high-quality hair extensions",
    duration: 120,
    pricing: 150,
    category: "Hair",
    professional: "648ef422f2052ea3dcb6f240",
    image: "https://example.com/hair-extensions.jpg",
  },
  {
    name: "Keratin Treatment",
    description: "Smooth and frizz-free hair with a keratin treatment",
    duration: 180,
    pricing: 200,
    category: "Hair",
    professional: "648ef44ef2052ea3dcb6f247",
    image: "https://example.com/keratin-treatment.jpg",
  },
  {
    name: "Perm",
    description: "Get beautiful curls and waves with a professional perm",
    duration: 120,
    pricing: 90,
    category: "Hair",
    professional: "648ef48bf2052ea3dcb6f24e",
    image: "https://example.com/perm.jpg",
  },
  {
    name: "Hair Spa Treatment",
    description:
      "Revitalize and nourish your hair with a luxurious spa treatment",
    duration: 90,
    pricing: 80,
    category: "Hair",
    professional: "648ef4bdf2052ea3dcb6f255",
    image: "https://example.com/hair-spa-treatment.jpg",
  },
  {
    name: "Bridal Hair",
    description: "Stunning bridal hairstyles for your special day",
    duration: 120,
    pricing: 150,
    category: "Hair",
    professional: "648ef36df2052ea3dcb6f21e",
    image: "https://example.com/bridal-hair.jpg",
  },
];
