const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");
const { Op } = require('sequelize');

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Farmer only)
exports.createProduct = async (req, res) => {
  try {
    // Validate required fields
    const { name, price, categoryId, quantityAvailable } = req.body;
    
    if (!name || !price || !categoryId || quantityAvailable === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, price, categoryId, and quantityAvailable are required fields"
      });
    }

    // Set farmer ID from authenticated user
    req.body.farmerId = req.user.id;

    const product = await Product.create(req.body);

    // Fetch created product with associations
    const productWithAssociations = await Product.findByPk(product.id, {
      include: [
        { 
          model: User, 
          as: 'farmer', 
          attributes: ['id', 'name', 'email', 'phone', 'street', 'city', 'state', 'zipCode'] // FIXED: Added separate address fields
        },
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'description'] 
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: productWithAssociations,
    });
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, farmer, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    const where = { isActive: true };
    const offset = (page - 1) * limit;

    // Search filter by name or description
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Category filter
    if (category) {
      where.categoryId = category;
    }

    // Farmer filter
    if (farmer) {
      where.farmerId = farmer;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        { 
          model: User, 
          as: 'farmer', 
          attributes: ['id', 'name', 'email', 'phone', 'street', 'city', 'state', 'zipCode'] // FIXED: Replaced 'address' with separate fields
        },
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'description'] 
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count: products.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'farmer', 
          attributes: ['id', 'name', 'email', 'phone', 'street', 'city', 'state', 'zipCode'] // FIXED: Replaced 'address' with separate fields
        },
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'description'] 
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Farmer only)
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Authorization check
    if (product.farmerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this product",
      });
    }

    // Update product
    await Product.update(req.body, {
      where: { id: req.params.id }
    });

    // Fetch updated product with associations
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [
        { 
          model: User, 
          as: 'farmer', 
          attributes: ['id', 'name', 'email', 'phone'] 
        },
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'description'] 
        }
      ]
    });

    res.json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Farmer only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Authorization check
    if (product.farmerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    // Soft delete by setting isActive to false
    await product.update({ isActive: false });

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get farmer products
// @route   GET /api/products/farmer
// @access  Private (Farmer only)
exports.getFarmerProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: { farmerId: req.user.id },
      include: [
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name', 'description'] 
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      count: products.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: products,
    });
  } catch (error) {
    console.error("Get farmer products error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { 
        isActive: true,
        isFeatured: true 
      },
      include: [
        { 
          model: User, 
          as: 'farmer', 
          attributes: ['id', 'name', 'email', 'phone', 'street', 'city', 'state', 'zipCode'] // FIXED: Added address fields
        },
        { 
          model: Category, 
          as: 'category', 
          attributes: ['id', 'name'] 
        }
      ],
      limit: 8,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Delete a product image (remove from product.images and delete file)
// @route   DELETE /api/products/:id/images
// @access  Private (Farmer only)
exports.deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) return res.status(400).json({ success: false, message: 'imageUrl is required' });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.farmerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this product' });
    }

    // Remove the image URL from the images array
    const images = Array.isArray(product.images) ? product.images : [];
    const filtered = images.filter((img) => img !== imageUrl);

    // Persist updated images
    product.images = filtered;
    await product.save();

    // Attempt to delete file if it is a local upload (contains /uploads/)
    try {
      const urlObj = new URL(imageUrl);
      if (urlObj.pathname && urlObj.pathname.includes('/uploads/')) {
        const filename = urlObj.pathname.split('/uploads/').pop();
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    } catch (e) {
      // ignore non-URL or external URLs
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Delete product image error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};