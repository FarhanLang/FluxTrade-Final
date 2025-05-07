// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// Import controller (we'll create this next)
const { 
  addWishlistItem, 
  getWishlistItems, 
  deleteWishlistItem 
} = require('../controllers/wishlistController');

// Add item to wishlist (protected route)
router.post('/', verifyToken, addWishlistItem);

// Get user's wishlist items (protected route)
router.get('/', verifyToken, getWishlistItems);

// Delete an item from wishlist (protected route)
router.delete('/:id', verifyToken, deleteWishlistItem);

module.exports = router;