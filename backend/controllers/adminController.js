const { Appointment, User } = require("../models");
const bcrypt = require("bcrypt");

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

// Admin: Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({ where: { role: "doctor" } });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

// Admin: Create a doctor
exports.createDoctor = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingDoctor = await User.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const doctor = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
      role: "doctor",
    });

    res.status(201).json({ message: "Doctor created successfully", doctor });
  } catch (error) {
    //console.error("CREATE DOCTOR ERROR:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to create doctor" });
  }
};

// Admin: Update a doctor
exports.updateDoctor = async (req, res) => {
  const { doctorId } = req.params;
  const { name, email } = req.body;

  try {
    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found" });
    }

    doctor.name = name || doctor.name;
    doctor.email = email || doctor.email;
    await doctor.save();

    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    res.status(500).json({ error: "Failed to update doctor" });
  }
};

// Admin: Delete a doctor
exports.deleteDoctor = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const doctor = await User.findByPk(doctorId);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await doctor.destroy();
    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete doctor" });
  }
};

// Admin: Get all patients
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await User.findAll({ where: { role: "patient" } });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};

// Admin: Delete a patient
exports.deletePatient = async (req, res) => {
  const { patientId } = req.params;

  try {
    const patient = await User.findByPk(patientId);
    if (!patient || patient.role !== "patient") {
      return res.status(404).json({ error: "Patient not found" });
    }

    await patient.destroy();
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete patient" });
  }
};

// Admin: get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: "doctor", attributes: ["name", "email"] },
        { model: User, as: "patient", attributes: ["name", "email"] },
      ],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
};

// Admin: Delete an appointment
exports.deleteAppointment = async (req, res) => {
  const { appointmentId } = req.params;

  try {
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await appointment.destroy();
    res.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

// Admin: Create an appointment
exports.createAdminAppointment = async (req, res) => {
  const { date, timeSlot, patientId, doctorId } = req.body;

  try {
    // Validate time slot
    if (!isValidTimeSlot(timeSlot)) {
      return res.status(400).json({
        error:
          "Invalid time slot. Use one-hour intervals (e.g., 09:00, 10:00).",
      });
    }

    // Check if the patient already has an appointment in the same time slot
    const existingAppointment = await Appointment.findOne({
      where: { patientId, date, timeSlot },
    });

    if (existingAppointment) {
      return res.status(400).json({
        error: "This patient already has an appointment in this time slot.",
      });
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
      patientId,
      doctorId,
    });

    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
};
