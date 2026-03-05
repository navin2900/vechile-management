const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    mileage: { type: Number, required: true },
    description: { type: String },
    category: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs/paths
    bodyType: { type: String },
    fuelType: { type: String },
    transmission: { type: String },
    seatingCapacity: { type: Number },
    color: { type: String },
    engineCapacity: { type: String },
    safetyRating: { type: Number },
    airbags: { type: Number },
    power: { type: String },
    torque: { type: String },
    documents: {
        rc: { type: String },
        insurance: { type: String },
        puc: { type: String }
    },
    violations: { type: String }, // Details about any violations
    specs: { type: String },      // Additional specs keywords for searching
    isVerified: { type: Boolean, default: false }, // Admin approval
    status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
    biddingEnabled: { type: Boolean, default: true },
    negotiable: { type: Boolean, default: false },
    isHidden: { type: Boolean, default: false },
    isBlacklisted: { type: Boolean, default: false },
    currentHighestBid: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
