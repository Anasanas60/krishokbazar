const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, street, city, state, zipCode } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      street,
      city,
      state,
      zipCode,
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          street: user.street,
          city: user.city,
          state: user.state,
          zipCode: user.zipCode,
        },
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.json({
      success: true,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        street: user.street,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    res.json({
      success: true,
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        street: user.street,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
