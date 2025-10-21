const express = require('express');
const { uploadProfileImage, uploadProductImages } = require('../controllers/uploadController');
const { verifyToken } = require('../utils/authMiddleware');

const router = express.Router();

// Upload profile picture (authenticated)
router.post('/profile', verifyToken, uploadProfileImage);

// Upload product images (authenticated)
router.post('/product', verifyToken, uploadProductImages);

module.exports = router;
