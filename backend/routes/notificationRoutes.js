// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Import controller
const { 
  getNotifications, 
  markAsRead, 
  deleteNotification 
} = require('../controllers/notificationController');

// Get user's notifications (protected route)
router.get('/', verifyToken, getNotifications);

// Mark notification as read (protected route)
router.put('/:id/read', verifyToken, markAsRead);

// Delete a notification (protected route)
router.delete('/:id', verifyToken, deleteNotification);

module.exports = router;