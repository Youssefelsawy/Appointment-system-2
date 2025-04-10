const { Appointment, User } = require("../models");

// Helper function to validate time slots
const isValidTimeSlot = (timeSlot) => {
  const validSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];
  return validSlots.includes(timeSlot);
};

// Patient: Create an appointment
exports.createPatientAppointment = async (req, res) => {
  const { date, timeSlot, doctorId } = req.body;

  try {
    // Ensure the user is a patient
    if (req.user.role !== "patient") {
      return res.status(403).json({
        error: "Access denied. Only patients can create appointments.",
      });
    }

    // Validate time slot
    if (!isValidTimeSlot(timeSlot)) {
      return res.status(400).json({
        error:
          "Invalid time slot. Use one-hour intervals (e.g., 09:00, 10:00).",
      });
    }

    // Check if the patient already has an appointment in the same time slot
    const existingAppointment = await Appointment.findOne({
      where: { patientId: req.user.id, date, timeSlot },
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ error: "You already have an appointment in this time slot." });
    }

    // Check if the doctor already has an appointment in the same time slot
    const existingDoctorAppointment = await Appointment.findOne({
      where: { doctorId, date, timeSlot },
    });

    if (existingDoctorAppointment) {
      return res.status(400).json({
        error: "This doctor is already booked for this time slot.",
      });
    }

    // Create the appointment
    const appointment = await Appointment.create({
      date,
      timeSlot,
      patientId: req.user.id,
      doctorId,
    });

    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Patient: View their appointments
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { patientId: req.user.id },
      include: [{ model: User, as: "doctor", attributes: ["name", "email"] }],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Patient: View Doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { role: "doctor" },
      attributes: ["id", "name", "email"],
    });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

// Guest: Register an appointment
exports.createGuestAppointment = async (req, res) => {
  const { email, date, timeSlot, doctorId } = req.body;

  // Validate time slot
  if (!isValidTimeSlot(timeSlot)) {
    return res.status(400).json({
      error: "Invalid time slot. Use one-hour intervals (e.g., 09:00, 10:00).",
    });
  }

  try {
    // Create a guest user if not exists
    let guest = await User.findOne({ where: { email, isGuest: true } });
    if (!guest) {
      guest = await User.create({ email, isGuest: true, role: "patient" });
    }

    const existing = await Appointment.findOne({
      where: { doctorId, date, timeSlot },
    });

    if (existing) {
      return res.status(400).json({
        error: "This doctor is already booked for this time slot.",
      });
    }

    // Create an appointment
    const appointment = await Appointment.create({
      date,
      timeSlot,
      patientId: guest.id,
      doctorId,
    });

    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

// Doctor: View their appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      where: { doctorId: req.user.id },
      include: [{ model: User, as: "patient", attributes: ["name", "email"] }],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Doctor: Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { appointmentId, status } = req.body;

  try {
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment || appointment.doctorId !== req.user.id) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    res.json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment status" });
  }
};
