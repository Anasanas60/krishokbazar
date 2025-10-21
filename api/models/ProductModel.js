const Sequelize = require('sequelize');
const { sequelize } = require('../db/connection');

const Product = sequelize.define('Product', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  farmerId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Please add a product name"
      }
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Please add a description"
      }
    }
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unit: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Please add a unit (e.g., lb, kg, bunch)"
      }
    }
  },
  quantityAvailable: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  images: {
    type: Sequelize.JSON, // Store array of image URLs as JSON
    allowNull: true,
    defaultValue: []
  },
  isOrganic: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  isFeatured: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  harvestDate: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  availableUntil: {
    type: Sequelize.DATE,
    allowNull: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
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
  tableName: 'products',
});

// Add associations
Product.associate = function(models) {
  Product.belongsTo(models.User, {
    foreignKey: 'farmerId',
    as: 'farmer'
  });
  Product.belongsTo(models.Category, {
    foreignKey: 'categoryId',
    as: 'category'
  });
  // Product.hasMany(models.OrderItem, {
  //   foreignKey: 'productId',
  //   as: 'orderItems'
  // });
};

module.exports = Product;