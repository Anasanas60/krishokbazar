const Sequelize = require('sequelize');
const { sequelize } = require('../db/connection');

const Category = sequelize.define('Category', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: {
        msg: "Please add a category name"
      }
    }
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  icon: {
    type: Sequelize.STRING,
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
  tableName: 'categories',
});

// Add associations
Category.associate = function(models) {
  Category.hasMany(models.Product, {
    foreignKey: 'categoryId',
    as: 'products'
  });
};

module.exports = Category;