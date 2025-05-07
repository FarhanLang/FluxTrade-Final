// controllers/listingController.js
const Listing = require('../models/Listing');
const User = require('../models/User'); // Not strictly used in the provided snippet but good to keep if needed elsewhere
const Wishlist = require('../models/Wishlist');
const Notification = require('../models/Notification');

// Helper function to create notifications for wishlist matches
async function createWishlistNotifications(listing) {
  try {
    // Find all wishlist items that match this listing's title
    // Using regex for case-insensitive match.
    // Consider if you want exact match or partial. For exact: new RegExp(`^${listing.title}$`, 'i')
    const matchingWishlists = await Wishlist.find({
      productName: { $regex: new RegExp(listing.title, 'i') }
    }); // Removed .populate('user') here as wishlistItem.user is already an ObjectId

    if (matchingWishlists.length > 0) {
      console.log(`Found ${matchingWishlists.length} wishlist matches for approved listing: ${listing.title}`);
      const notificationsToCreate = matchingWishlists.map(wishlistItem => {
        // Prevent self-notification: if the listing owner is the same as the wishlist owner
        if (listing.owner.toString() === wishlistItem.user.toString()) {
          console.log(`Skipping notification for user ${wishlistItem.user} as they own the listing.`);
          return null;
        }
        return {
          user: wishlistItem.user, // This is the ObjectId of the user who owns the wishlist item
          title: 'Wishlist Item Listed!', // Or 'Wishlist Match Found!'
          message: `An item you wished for, "${wishlistItem.productName}", matches the newly listed "${listing.title}".`,
          listingId: listing._id,
          isRead: false // Default is false, but good to be explicit
        };
      }).filter(n => n !== null); // Filter out any nulls (self-notifications)

      if (notificationsToCreate.length > 0) {
        await Notification.insertMany(notificationsToCreate);
        console.log(`Successfully created ${notificationsToCreate.length} notifications.`);
      }
    }
  } catch (error) {
    // Log the error but don't let it break the main verifyListing flow
    console.error('Error in createWishlistNotifications:', error);
  }
}


// Create a new listing (requires authentication)
const createListing = async (req, res) => {
  try {
    const { title, description, images, category, condition, location, price, tradePreference } = req.body;

    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Unauthorized: No valid token provided' });
    }

    const newListing = new Listing({
      title,
      description,
      images: images || [],
      category,
      condition,
      location,
      price,
      tradePreference: tradePreference || 'Sell',
      owner: req.user.userId,
      // verificationStatus is 'pending' by default as per your schema (assumed)
    });

    const savedListing = await newListing.save();
    // DO NOT create notifications here if listings require approval.
    // Notifications should be created when the listing becomes publicly visible/approved.
    res.status(201).json(savedListing);
  } catch (error) {
    console.error('Error in createListing:', error);
    res.status(500).json({ message: 'Server error creating listing', error: error.message });
  }
};

// Get all pending listings for verification (admin only)
const getPendingListings = async (req, res) => {
  try {
    // Your verifyToken middleware sets req.user.admin, not req.user.admin
    if (!req.user || !req.user.admin) { // <--- CHECKED req.user.admin based on your previous middleware info
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const pendingListings = await Listing.find({ verificationStatus: 'pending' })
      .populate('owner', 'username email');

    res.status(200).json(pendingListings);
  } catch (error) {
    console.error('Error in getPendingListings:', error);
    res.status(500).json({ message: 'Server error fetching pending listings', error: error.message });
  }
};

// Verify a listing (manual moderation by admin)
const verifyListing = async (req, res) => {
  try {
    const listingId = req.params.id; // Corrected from req.params.id
    const { action, notes } = req.body;

    // Ensure the requester is an admin
    // Your verifyToken middleware sets req.user.admin
    if (!req.user || !req.user.admin) { // <--- CHECKED req.user.admin
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (action === 'approve') {
      listing.verificationStatus = 'approved';
      listing.isVerified = true;
    } else if (action === 'reject') {
      listing.verificationStatus = 'rejected';
      listing.isVerified = false;
    } else {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject".' });
    }
    
    listing.verificationNotes = notes || '';
    // Assuming req.user from verifyToken has username: { userId: '...', username: 'test', isAdmin: true }
    listing.verifiedBy = req.user.username; // Store admin's username
    listing.verifiedAt = new Date();

    const updatedListing = await listing.save();

    // If the listing was approved, check wishlist matches and create notifications
    if (action === 'approve' && updatedListing.isVerified) {
      console.log(`Listing ${updatedListing.title} approved. Checking for wishlist notifications...`);
      await createWishlistNotifications(updatedListing); // Pass the updated listing
    }

    res.status(200).json({ 
      success: true, 
      data: updatedListing 
    });
  } catch (error) {
    console.error('Error in verifyListing:', error);
    res.status(500).json({
      message: 'Server error verifying listing',
      error: error.message
    });
  }
};

// Get the verification status of a listing (for users)
const getListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .select('title verificationStatus verificationNotes verifiedAt isVerified'); // Added isVerified

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error in getListingStatus:', error);
    res.status(500).json({ message: 'Server error fetching listing status', error: error.message });
  }
};

// Get all listings with optional filtering (only verified listings by default)
const getAllListings = async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) filter.category = req.query.category;
    if (req.query.condition) filter.condition = req.query.condition;
    if (req.query.location) filter.location = req.query.location;

    // Show only verified listings unless overridden by query param
    // Or if the user is an admin, they might see all
    if (req.query.showAll === 'true' && req.user && req.user.admin) {
        // Admin can see all if they request it
    } else {
      filter.isVerified = true; // Default for regular users
    }


    const listings = await Listing.find(filter)
      .populate('owner', 'username email');

    res.status(200).json(listings);
  } catch (error)
 {
    console.error('Error in getAllListings:', error);
    res.status(500).json({ message: 'Server error fetching listings', error: error.message });
  }
};

// Get a single listing by its ID (full details)
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate('owner', 'username email'); // Populate owner details

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Optionally, restrict access if listing is not verified and user is not owner/admin
    // if (!listing.isVerified && (!req.user || (listing.owner._id.toString() !== req.user.userId && !req.user.admin))) {
    //   return res.status(403).json({ message: 'This listing is not yet verified.' });
    // }

    res.status(200).json(listing);
  } catch (error) {
    console.error('Error in getListingById:', error);
    res.status(500).json({ message: 'Server error fetching listing by ID', error: error.message });
  }
};

module.exports = {
  createListing,
  getPendingListings,
  verifyListing, // This is the merged and corrected one
  getListingStatus,
  getAllListings,
  getListingById
};