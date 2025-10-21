const { Order, OrderItem, Product, User } = require("../models");
const { Op } = require('sequelize');
const { sequelize } = require('../db/connection');

// @desc    Create an order
// @route   POST /api/orders
// @access  Private (Consumer only)
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { farmerId, items, pickupDetails, deliveryDetails, notes } = req.body;

    // Validate required fields
    if (!farmerId || !items || !Array.isArray(items) || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Farmer ID and items array are required",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Validate products and calculate total
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }

      if (product.farmerId !== farmerId) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} does not belong to the specified farmer`,
        });
      }

      if (product.quantityAvailable < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: `Not enough quantity available for ${product.name}. Available: ${product.quantityAvailable}, Requested: ${item.quantity}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create order
    const orderData = {
      consumerId: req.user.id,
      farmerId: farmerId,
      totalAmount,
      notes,
      status: 'pending',
      paymentMethod: req.body.paymentMethod,
    };

    if (pickupDetails) {
      orderData.pickupDate = pickupDetails.date;
      orderData.pickupTime = pickupDetails.time;
      orderData.pickupLocation = pickupDetails.location;
    }

    if (deliveryDetails) {
      orderData.deliveryStreet = deliveryDetails.address.street;
      orderData.deliveryCity = deliveryDetails.address.city;
      orderData.deliveryState = deliveryDetails.address.state;
      orderData.deliveryZipCode = deliveryDetails.address.zipCode;
      orderData.deliveryDate = deliveryDetails.date;
      orderData.deliveryTime = deliveryDetails.time;
    }

    const order = await Order.create(orderData, { transaction });

    // Create order items
    const orderItemsWithOrderId = orderItems.map(item => ({
      ...item,
      orderId: order.id
    }));

    await OrderItem.bulkCreate(orderItemsWithOrderId, { transaction });

    // Commit transaction
    await transaction.commit();

    // Fetch complete order with associations
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: User,
          as: "farmer",
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: User,
          as: "consumer",
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ["id", "name", "images"]
          }]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: completeOrder,
    });
  } catch (error) {
    // Only rollback if transaction is still active
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// @desc    Get consumer orders
// @route   GET /api/orders/consumer
// @access  Private (Consumer only)
exports.getConsumerOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { consumerId: req.user.id },
      include: [
        {
          model: User,
          as: "farmer",
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ["id", "name", "images", "categoryId"]
          }]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Private (Farmer only)
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { farmerId: req.user.id },
      include: [
        {
          model: User,
          as: "consumer",
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ["id", "name", "images", "categoryId"]
          }]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "consumer",
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: User,
          as: "farmer",
          attributes: ["id", "name", "email", "phone"]
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ["id", "name", "images", "description", "categoryId"]
          }]
        }
      ],
    });

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    // Authorization check
    if (order.consumerId !== req.user.id && order.farmerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Not authorized to view this order" 
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private (Farmer or Admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found" 
      });
    }

    if (order.farmerId !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this order",
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "consumer",
          attributes: ["id", "name", "email"]
        },
        {
          model: User,
          as: "farmer",
          attributes: ["id", "name", "email"]
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            attributes: ["id", "name"]
          }]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: error.message 
    });
  }
};