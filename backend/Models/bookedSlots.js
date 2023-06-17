const mongoose = require("mongoose");

const bookedSlotSchema = new mongoose.Schema({
  professionalID: {
    type: String,
    required: true,
  },
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
});

const BookedSlotsModel = mongoose.model("BookedSlots", bookedSlotSchema);

module.exports = BookedSlotsModel;
