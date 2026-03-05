const express = require('express');
const Bid = require('../models/Bid');
const Vehicle = require('../models/Vehicle');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper to emit socket events
const emitBidUpdate = (req, vehicleId, bidData) => {
    if (req.io) {
        req.io.to(`vehicle_${vehicleId}`).emit('new_bid', bidData);
    }
};

// Place a bid
router.post('/', protect, async (req, res) => {
    try {
        const { vehicleId, amount } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        if (!vehicle.biddingEnabled) return res.status(400).json({ message: 'Bidding is currently stopped for this vehicle' });

        if (amount <= vehicle.currentHighestBid) {
            return res.status(400).json({ message: `Bid must be higher than current highest bid (${vehicle.currentHighestBid})` });
        }

        const bid = new Bid({
            vehicle: vehicleId,
            bidder: req.user.id,
            amount
        });

        await bid.save();

        // Update vehicle's highest bid
        vehicle.currentHighestBid = amount;
        await vehicle.save();

        const populatedBid = await Bid.findById(bid._id).populate('bidder', 'name');

        // Socket emit
        emitBidUpdate(req, vehicleId, populatedBid);

        res.status(201).json(populatedBid);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get bids for a vehicle
router.get('/:vehicleId', async (req, res) => {
    try {
        const bids = await Bid.find({ vehicle: req.params.vehicleId })
            .populate('bidder', 'name')
            .sort({ amount: -1 });
        res.json(bids);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Intervention: Stop/Start Bidding
router.put('/:vehicleId/toggle-bidding', protect, admin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        vehicle.biddingEnabled = !vehicle.biddingEnabled;
        await vehicle.save();

        if (req.io) {
            req.io.to(`vehicle_${vehicle._id}`).emit('bidding_status_changed', { biddingEnabled: vehicle.biddingEnabled });
        }

        res.json({ message: `Bidding ${vehicle.biddingEnabled ? 'enabled' : 'disabled'}`, biddingEnabled: vehicle.biddingEnabled });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
