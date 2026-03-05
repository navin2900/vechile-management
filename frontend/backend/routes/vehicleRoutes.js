const express = require('express');
const multer = require('multer');
const path = require('path');
const Vehicle = require('../models/Vehicle');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Get all verified vehicles
router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword ? {
            $or: [
                { brand: { $regex: req.query.keyword, $options: 'i' } },
                { model: { $regex: req.query.keyword, $options: 'i' } },
                { specs: { $regex: req.query.keyword, $options: 'i' } },
                { violations: { $regex: req.query.keyword, $options: 'i' } }
            ]
        } : {};

        // Only fetch verified, non-hidden, non-blacklisted vehicles unless admin
        const vehicles = await Vehicle.find({ ...keyword, isVerified: true, isHidden: false, isBlacklisted: false }).populate('seller', 'name email');
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin get all vehicles
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const vehicles = await Vehicle.find().populate('seller', 'name email');
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get vehicle by ID
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id).populate('seller', 'name email mobile');
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create new vehicle (Requires matching role seller/buyer)
router.post('/', protect, upload.fields([{ name: 'images', maxCount: 5 }, { name: 'rc', maxCount: 1 }, { name: 'puc', maxCount: 1 }, { name: 'insurance', maxCount: 1 }]), async (req, res) => {
    try {
        const { brand, model, year, price, mileage, description, category, location, violations, specs } = req.body;

        let images = [];
        if (req.files.images) images = req.files.images.map(f => f.path);

        const documents = {
            rc: req.files.rc ? req.files.rc[0].path : '',
            puc: req.files.puc ? req.files.puc[0].path : '',
            insurance: req.files.insurance ? req.files.insurance[0].path : ''
        };

        const vehicle = new Vehicle({
            seller: req.user.id,
            brand, model, year, price, mileage, description, category, location, violations, specs,
            images, documents
        });

        const savedVehicle = await vehicle.save();
        res.status(201).json(savedVehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Verify Vehicle (Admin only)
router.put('/:id/verify', protect, admin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        vehicle.isVerified = true;
        const updated = await vehicle.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Actions: Hide, Unhide, Blacklist
router.put('/:id/admin-action', protect, admin, async (req, res) => {
    try {
        const { action } = req.body;
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        switch (action) {
            case 'hide':
                vehicle.isHidden = true;
                break;
            case 'unhide':
                vehicle.isHidden = false;
                break;
            case 'blacklist':
                vehicle.isBlacklisted = true;
                vehicle.isHidden = true; // Auto-hide if blacklisted
                break;
            case 'unblacklist':
                vehicle.isBlacklisted = false;
                break;
            default:
                return res.status(400).json({ message: 'Invalid action' });
        }

        const updated = await vehicle.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Action: Delete Vehicle
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        await Vehicle.deleteOne({ _id: req.params.id });
        res.json({ message: 'Vehicle removed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Action: Quick Edit Vehicle details
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        res.json(vehicle);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
