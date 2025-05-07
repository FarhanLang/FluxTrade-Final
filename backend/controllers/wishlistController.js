// controllers/wishlistController.js
const Wishlist = require('../models/Wishlist');

exports.addWishlistItem = async (req, res) => {
  try {
    console.log('Backend: addWishlistItem - req.body:', req.body);
    console.log('Backend: addWishlistItem - req.user:', req.user);

    const { productName } = req.body;
    
    if (!productName) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    // Use req.user.userId
    if (!req.user || !req.user.userId) { // <--- CHANGED HERE
        console.error('Backend: addWishlistItem - userId not found in req.user. req.user:', req.user);
        return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }

    const wishlistItem = new Wishlist({
      user: req.user.userId, // <--- CHANGED HERE
      productName: productName
    });

    await wishlistItem.save();
    
    res.status(201).json({
      success: true,
      data: wishlistItem
    });
  } catch (error) {
    console.error('Backend: addWishlistItem - Error caught:', error); 
    if (error.code === 11000) {
      return res.status(400).json({ message: 'This item is already in your wishlist' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getWishlistItems = async (req, res) => {
  try {
    console.log('Backend: getWishlistItems - req.user:', req.user);
    // Use req.user.userId
    if (!req.user || !req.user.userId) { // <--- CHANGED HERE
        console.error('Backend: getWishlistItems - userId not found in req.user. req.user:', req.user);
        return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }

    const wishlistItems = await Wishlist.find({ user: req.user.userId }) // <--- CHANGED HERE
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: wishlistItems.length,
      data: wishlistItems
    });
  } catch (error) {
    console.error('Backend: getWishlistItems - Error caught:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteWishlistItem = async (req, res) => {
  try {
    console.log('Backend: deleteWishlistItem - req.user:', req.user);
    console.log('Backend: deleteWishlistItem - req.params.id:', req.params.id);

    // Use req.user.userId
    if (!req.user || !req.user.userId) { // <--- CHANGED HERE
        console.error('Backend: deleteWishlistItem - userId not found in req.user. req.user:', req.user);
        return res.status(401).json({ message: 'User not authenticated or user ID missing.' });
    }

    const wishlistItem = await Wishlist.findById(req.params.id);
    
    if (!wishlistItem) {
      return res.status(404).json({ message: 'Wishlist item not found' });
    }
    
    if (wishlistItem.user.toString() !== req.user.userId) { // <--- CHANGED HERE
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Wishlist.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Backend: deleteWishlistItem - Error caught:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};