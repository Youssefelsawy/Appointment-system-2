const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: function () {
        return this.isGuest === true;
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true, // Allow null for guest users (only email)
    },
    role: {
      type: DataTypes.ENUM("admin", "doctor", "patient"),
      allowNull: false,
      defaultValue: "patient", // Default role for registrations
    },
    isGuest: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
