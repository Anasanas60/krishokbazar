const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../db/connection');

const FarmerProfile = sequelize.define('FarmerProfile', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  farmName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Please add a farm name"
      }
    }
  },
  farmDescription: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  farmLocation: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  farmLat: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  farmLng: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  yearsFarming: {
    type: Sequelize.INTEGER,
    allowNull: true,
    validate: {
      min: 0
    }
  },
  certification: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  deliveryOptions: {
    type: Sequelize.JSON,
    defaultValue: []
  },
  paymentOptions: {
    type: Sequelize.JSON,
    defaultValue: []
  },
  isVerified: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  totalRatings: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
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
  tableName: 'farmer_profiles',
});

// Add associations
FarmerProfile.associate = function(models) {
  FarmerProfile.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = FarmerProfile;