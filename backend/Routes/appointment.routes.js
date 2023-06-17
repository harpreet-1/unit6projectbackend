const express = require("express");
const AppointmentModel = require("../Models/appointment");
const apoointmentRouter = express.Router();

// POST /appointments/book----------------
apoointmentRouter.post("/book", async (req, res) => {
  try {
    const { beautyProfessionalID, service, date, time, notes } = req.body;
    const customerID = req.customerID;

    const existingAppointment = await AppointmentModel.findOne({
      beautyProfessionalID: beautyProfessionalID,
      date: date,
      time: time,
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "Appointment slot is already booked",
      });
    }
    const newAppointment = new AppointmentModel({
      customerID,
      beautyProfessionalID,
      service,
      date,
      time,
      notes,
    });

    const savedAppointment = await newAppointment.save();

    res.status(201).json({ success: true, appointment: savedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ---------------------- /appointments/professional/-------------------------
apoointmentRouter.get("/", async (req, res) => {
  try {
    const professionalID = req.professionalID;

    const appointments = await AppointmentModel.find({
      beautyProfessionalID: professionalID,
    })
      .sort({ date: 1, time: 1 })
      .populate("customerID")
      .populate("service");

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

apoointmentRouter.put("/status/:appointmentID", async (req, res) => {
  try {
    const appointmentID = req.params.appointmentID;
    const { status } = req.body;

    // Find the appointment by ID and update the status
    const appointment = await AppointmentModel.findByIdAndUpdate(
      appointmentID,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
