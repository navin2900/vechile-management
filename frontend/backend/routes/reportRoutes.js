const express = require('express');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Bid = require('../models/Bid');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get Admin System Reports
router.get('/', protect, admin, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const buyers = await User.countDocuments({ role: 'buyer' });
        const sellers = await User.countDocuments({ role: 'seller' });

        const totalVehicles = await Vehicle.countDocuments();
        const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
        const soldVehicles = await Vehicle.countDocuments({ status: 'Sold' });
        const unverifiedVehicles = await Vehicle.countDocuments({ isVerified: false });

        const totalBids = await Bid.countDocuments();

        res.json({
            users: { total: totalUsers, buyers, sellers },
            vehicles: { total: totalVehicles, available: availableVehicles, sold: soldVehicles, unverified: unverifiedVehicles },
            bids: { total: totalBids }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
