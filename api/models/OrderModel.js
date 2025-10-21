const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  quantity: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
}, {
  tableName: 'order_items',
});

const Order = sequelize.define('Order', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  consumerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  farmerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  pickupDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  pickupTime: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  pickupLocation: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  deliveryStreet: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  deliveryCity: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  deliveryState: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  deliveryZipCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  deliveryDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  deliveryTime: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'other'),
    defaultValue: 'cash',
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  tableName: 'orders',
});

// Add associations with UNIQUE aliases
Order.associate = function(models) {
  Order.belongsTo(models.User, {
    foreignKey: 'consumerId',
    as: 'consumer'
  });
  Order.belongsTo(models.User, {
    foreignKey: 'farmerId',
    as: 'farmer'
  });
  Order.hasMany(models.OrderItem, {
    foreignKey: 'orderId',
    as: 'orderItems' // Changed from 'items' to 'orderItems'
  });
  Order.hasMany(models.Message, {
    foreignKey: 'relatedOrderId',
    as: 'orderMessages' // Changed from 'messages' to 'orderMessages'
  });
};

OrderItem.associate = function(models) {
  OrderItem.belongsTo(models.Order, {
    foreignKey: 'orderId',
    as: 'orderDetail' // Changed from 'order' to 'orderDetail'
  });
  OrderItem.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'product'
  });
};

// Remove the direct associations - let Sequelize handle them through the associate methods
// Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
// OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

module.exports = { Order, OrderItem };