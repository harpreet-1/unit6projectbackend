const express = require("express");
const AppointmentModel = require("../Models/appointment");
const professionalAuth = require("../Middlewares/professionalAuth");
const userAuth = require("../Middlewares/userAuth");
const apoointmentRouter = express.Router();

// POST /appointments/book----------------
apoointmentRouter.post("/book", userAuth, async (req, res) => {
  try {
    const { beautyProfessionalID, service, date, time, notes } = req.body;
    const customerID = req.user._id;

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
      beautyProfessionalID: ProfessionalID,
      service: service,
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

// ---------------------- /appointments/professional/-------------------------p

// apoointmentRouter.use(professionalAuth);

apoointmentRouter.get("/", async (req, res) => {
  try {
    const professionalID = "648e95f137b1838d156af177";

    // const appointments = await AppointmentModel.find({
    //   beautyProfessionalID: "648e95f137b1838d156af177",
    // });
    const appointments = await AppointmentModel.find({
      beautyProfessionalID: "648e95f137b1838d156af177",
    })
      .sort({
        date: 1,
        time: 1,
      })
      .populate("customerID")
      .populate("service")
      .populate("beautyProfessionalID");

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

module.exports = apoointmentRouter;
