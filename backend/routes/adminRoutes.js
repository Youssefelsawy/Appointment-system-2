const express = require("express");
const { authenticate, checkRole } = require("../middleware/auth");
const {
  getAllDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllPatients,
  deletePatient,
  getAllAppointments,
  deleteAppointment,
  createAdminAppointment,
} = require("../controllers/adminController");

const router = express.Router();

// Admin: Manage doctors
router.get("/doctors", authenticate, checkRole("admin"), getAllDoctors);
router.post("/doctors", authenticate, checkRole("admin"), createDoctor);
router.put(
  "/doctors/:doctorId",
  authenticate,
  checkRole("admin"),
  updateDoctor
);
router.delete(
  "/doctors/:doctorId",
  authenticate,
  checkRole("admin"),
  deleteDoctor
);

// Admin: Manage patients
router.get("/patients", authenticate, checkRole("admin"), getAllPatients);
router.delete(
  "/patients/:patientId",
  authenticate,
  checkRole("admin"),
  deletePatient
);

// Admin: Manage appointments
router.get(
  "/appointments",
  authenticate,
  checkRole("admin"),
  getAllAppointments
);
router.delete(
  "/appointments/:appointmentId",
  authenticate,
  checkRole("admin"),
  deleteAppointment
);
router.post(
  "/appointments",
  authenticate,
  checkRole("admin"),
  createAdminAppointment
);

module.exports = router;
