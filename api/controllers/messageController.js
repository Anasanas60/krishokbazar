const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const { Op } = require('sequelize');

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, relatedOrder } = req.body;

    const receiverUser = await User.findByPk(receiverId);
    if (!receiverUser) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found" });
    }

    const messageRecord = await Message.create({
      senderId: req.user.id,
      receiverId: receiverId,
      content: message,
      relatedOrder,
    });

    res.status(201).json({
      success: true,
      data: messageRecord,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id, receiverId: req.params.userId },
          { senderId: req.params.userId, receiverId: req.user.id },
        ],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["name", "role"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["name", "role"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [{ senderId: req.user.id }, { receiverId: req.user.id }],
      },
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["name", "role"],
        },
        {
          model: User,
          as: "receiver",
          attributes: ["name", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const conversations = {};

    messages.forEach((message) => {
      const otherUser =
        message.senderId === req.user.id ? message.receiver : message.sender;

      const conversationId = otherUser.id;

      if (!conversations[conversationId]) {
        conversations[conversationId] = {
          user: {
            id: otherUser.id,
            name: otherUser.name,
            role: otherUser.role,
          },
          lastMessage: {
            content: message.content,
            createdAt: message.createdAt,
            isRead: message.isRead,
          },
          unreadCount:
            message.receiverId === req.user.id && !message.isRead ? 1 : 0,
        };
      } else if (message.receiverId === req.user.id && !message.isRead) {
        conversations[conversationId].unreadCount += 1;
      }
    });

    res.json({
      success: true,
      count: Object.keys(conversations).length,
      data: Object.values(conversations),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:userId
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    await Message.update(
      { isRead: true },
      {
        where: {
          senderId: req.params.userId,
          receiverId: req.user.id,
          isRead: false,
        },
      }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
