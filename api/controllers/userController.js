const { User, FarmerProfile } = require("../models");
const { Op } = require('sequelize');

// @desc    Get all farmers
// @route   GET /api/users/farmers
// @access  Public
exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.findAll({
      where: { role: "farmer" },
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      count: farmers.length,
      data: farmers,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get farmer profile
// @route   GET /api/users/farmers/:id
// @access  Public
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findOne({
      where: { id: req.params.id, role: "farmer" },
      attributes: { exclude: ['password'] }
    });

    if (!farmer) {
      return res
        .status(404)
        .json({ success: false, message: "Farmer not found" });
    }

    const farmerProfile = await FarmerProfile.findOne({ where: { userId: req.params.id } });

    res.json({
      success: true,
      data: {
        farmer,
        profile: farmerProfile || {},
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Create or update farmer profile
// @route   PUT /api/users/farmers/profile
// @access  Private (Farmer only)
exports.updateFarmerProfile = async (req, res) => {
  try {
    const {
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    } = req.body;

    const profileFields = {
      userId: req.user.id,
      farmName,
      description,
      farmImages,
      farmingPractices,
      establishedYear,
      socialMedia,
      businessHours,
      acceptsPickup,
      acceptsDelivery,
      deliveryRadius,
    };

    let farmerProfile = await FarmerProfile.findOne({ where: { userId: req.user.id } });

    if (farmerProfile) {
      farmerProfile = await FarmerProfile.update(profileFields, {
        where: { userId: req.user.id },
        returning: true
      });
      farmerProfile = farmerProfile[1][0];
    } else {
      farmerProfile = await FarmerProfile.create(profileFields);
    }

    res.json({
      success: true,
      data: farmerProfile,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = name || user.name;
      user.phone = phone || user.phone;
      user.address = address || user.address;
      // allow updating profile picture
      if (req.body.profilePicture) {
        user.profilePicture = req.body.profilePicture;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phone: updatedUser.phone,
          address: updatedUser.address,
          profilePicture: updatedUser.profilePicture || null,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.destroy();

    res.json({
      success: true,
      message: "User removed",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
