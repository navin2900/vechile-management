const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Get conversation with a specific user regarding a vehicle
router.get('/:userId/:vehicleId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: req.params.userId, vehicle: req.params.vehicleId },
                { sender: req.params.userId, receiver: req.user.id, vehicle: req.params.vehicleId }
            ]
        }).sort('createdAt');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send a message
router.post('/', protect, async (req, res) => {
    try {
        const { receiverId, vehicleId, content } = req.body;
        const message = new Message({
            sender: req.user.id,
            receiver: receiverId,
            vehicle: vehicleId,
            content
        });

        await message.save();

        const populated = await Message.findById(message._id).populate('sender', 'name').populate('receiver', 'name');

        // Emit socket event
        if (req.io) {
            req.io.emit(`receive_message_${receiverId}`, populated);
        }

        res.status(201).json(populated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all contacts/inbox for logged in user
router.get('/inbox', protect, async (req, res) => {
    try {
        // Basic implementation: find last message for each unique conversation user is part of
        const messages = await Message.find({
            $or: [{ sender: req.user.id }, { receiver: req.user.id }]
        })
            .populate('sender', 'name')
            .populate('receiver', 'name')
            .populate('vehicle', 'brand model')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
