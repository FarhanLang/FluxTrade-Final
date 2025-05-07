// controllers/notificationController.js
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    // Add similar logging and checks if needed, then change to userId
    if (!req.user || !req.user.userId) { // <--- CHANGED HERE (and add console.error if it fails)
      console.error('Backend: getNotifications - userId not found in req.user. req.user:', req.user);
      return res.status(401).json({ message: 'Not authorized or user ID missing' });
    }
    const notifications = await Notification.find({ user: req.user.userId }) // <--- CHANGED HERE
      .sort({ createdAt: -1 })
      .populate('listingId', 'title images');
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Backend: getNotifications - Error caught:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) { // <--- CHANGED HERE
      console.error('Backend: markAsRead - userId not found in req.user. req.user:', req.user);
      return res.status(401).json({ message: 'Not authorized or user ID missing' });
    }
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.user.toString() !== req.user.userId) { // <--- CHANGED HERE
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('Backend: markAsRead - Error caught:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) { // <--- CHANGED HERE
      console.error('Backend: deleteNotification - userId not found in req.user. req.user:', req.user);
      return res.status(401).json({ message: 'Not authorized or user ID missing' });
    }
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    if (notification.user.toString() !== req.user.userId) { // <--- CHANGED HERE
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Backend: deleteNotification - Error caught:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};