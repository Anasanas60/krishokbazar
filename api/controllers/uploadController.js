const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Upload profile image (single)
exports.uploadProfileImage = [
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
      const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      return res.json({ success: true, data: { url } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
];

// Upload product images (multiple)
exports.uploadProductImages = [
  upload.array('images', 6),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'No files uploaded' });
      const urls = req.files.map(f => `${req.protocol}://${req.get('host')}/uploads/${f.filename}`);
      return res.json({ success: true, data: { urls } });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
];
