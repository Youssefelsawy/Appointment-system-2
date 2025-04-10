const User = require("./User");
const Appointment = require("./Appointment");

// Doctor has many Appointments
User.hasMany(Appointment, { foreignKey: "doctorId", as: "doctorAppointments" });
Appointment.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });

// Patient has many Appointments
User.hasMany(Appointment, {
  foreignKey: "patientId",
  as: "patientAppointments",
});
Appointment.belongsTo(User, { foreignKey: "patientId", as: "patient" });

module.exports = { User, Appointment };
