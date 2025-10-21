const Sequelize = require('sequelize');
const { sequelize } = require('../db/connection');

const Message = sequelize.define('Message', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  receiverId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Message content is required"
      }
    }
  },
  relatedOrderId: {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: 'orders',
      key: 'id'
    }
  },
  isRead: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
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
  tableName: 'messages',
});

// Add associations
Message.associate = function(models) {
  Message.belongsTo(models.User, {
    foreignKey: 'senderId',
    as: 'sender'
  });
  Message.belongsTo(models.User, {
    foreignKey: 'receiverId',
    as: 'receiver'
  });
  // Message.belongsTo(models.Order, {
  //   foreignKey: 'relatedOrderId',
  //   as: 'relatedOrder'
  // });
};

module.exports = Message;