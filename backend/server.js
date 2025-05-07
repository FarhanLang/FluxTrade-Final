// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const connectDB = require('./config/db'); // Ensure this path is correct relative to server.js
const userRoutes = require('./routes/userRoutes');
const referralRoutes = require('./routes/referralRoutes');
const listingRoutes = require('./routes/listingRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // Assuming this is for admin actions on data
const adminAuthRoutes = require('./routes/adminAuthRoutes'); // Assuming you created this for admin login
const forumRoutes = require('./routes/forumRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
// Configure CORS:
// For development, "*" might be okay. For production, restrict it.
// Render will provide a FRONTEND_URL environment variable once your Vercel frontend is deployed.
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) or from your frontend URL
    const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : [];
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') { // Allow all in dev
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If your frontend needs to send cookies or authorization headers
};
app.use(cors(corsOptions));

app.use(express.json()); // Middleware to parse JSON bodies

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/listings', listingRoutes);
// app.use('/api/admin', adminRoutes); // For admin data operations
app.use('/api/auth/admin', adminAuthRoutes); // For admin login (POST /api/auth/admin/signin)
app.use('/api/forum', forumRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stripe', stripeRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic health check or API root route
app.get('/api', (req, res) => { // Changed from '/' to '/api' to avoid conflict if deployed with frontend on same domain root
  res.send('FluxTrade Platform API is running');
});

// Fallback for unhandled API routes (optional)
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});


// Start server
const PORT = process.env.PORT || 5000; // Render will inject the PORT environment variable
app.listen(PORT, '0.0.0.0', () => {   // Listen on 0.0.0.0 for Render
  console.log(`Server running on port ${PORT}`);
  console.log(`Allowed frontend URL (CORS): ${process.env.FRONTEND_URL || 'Not set (allowing all in dev)'}`);
});