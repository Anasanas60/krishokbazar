const Sequelize = require('sequelize');
const { sequelize } = require('../db/connection');
const bcrypt = require("bcryptjs");

const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Please add a name"
      }
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: {
        msg: "Please add a valid email"
      },
      notEmpty: {
        msg: "Please add an email"
      }
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: "Password must be at least 6 characters long"
      }
    }
  },
  role: {
    type: Sequelize.ENUM,
    values: ['consumer', 'farmer', 'admin'],
    defaultValue: 'consumer',
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  street: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  city: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  profilePicture: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  state: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  zipCode: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  lat: {
    type: Sequelize.FLOAT,
    allowNull: true,
  },
  lng: {
    type: Sequelize.FLOAT,
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
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to match password
User.prototype.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Add associations
User.associate = function(models) {
  User.hasMany(models.Product, {
    foreignKey: 'farmerId',
    as: 'products'
  });
  User.hasMany(models.Order, {
    foreignKey: 'consumerId',
    as: 'consumerOrders'
  });
  User.hasMany(models.Order, {
    foreignKey: 'farmerId',
    as: 'farmerOrders'
  });
  User.hasOne(models.FarmerProfile, {
    foreignKey: 'userId',
    as: 'farmerProfile'
  });
  User.hasMany(models.Message, {
    foreignKey: 'senderId',
    as: 'sentMessages'
  });
  User.hasMany(models.Message, {
    foreignKey: 'receiverId',
    as: 'receivedMessages'
  });
};

module.exports = User;