const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const { User } = require("../models");

// Patient Registration
exports.register = [
  // Validation middleware
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  check("role").equals("patient").withMessage("Only patients can register"),

  // Controller
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      if (role !== "patient") {
        return res.status(400).json({ message: "Only patients can register." });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
      }

      // Create the user
      const user = await User.create({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: role || "patient", // Default to 'patient' if not provided
        isGuest: false,
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
      );

      // Respond with the user and token
      res.status(201).json({
        message: "Patient registered successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed. Please try again." });
    }
  },
];

// Login (All Roles)
exports.login = [
  // Validation middleware
  check("email").isEmail().withMessage("Invalid email"),
  check("password").notEmpty().withMessage("Password is required"),

  // Controller
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Check password
      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
      );

      // Omit password from response
      const { password: _, ...userData } = user.get({ plain: true });

      res.json({
        message: "Login successful",
        token,
        user: userData,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed. Please try again." });
    }
  },
];
