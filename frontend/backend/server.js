require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // We allows all origins for local dev; in prod restrict to frontend domain
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Static folder for uploads
app.use('/uploads', express.static('uploads'));

// DB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vehicle_bidding';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Make io accessible to our routers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Basic Route
app.get('/', (req, res) => {
    res.send('Vehicle Bidding API Running');
});

// Socket.io for Real-time Bidding & Chat
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join specific vehicle room for bids
    socket.on('join_vehicle_room', (vehicleId) => {
        socket.join(`vehicle_${vehicleId}`);
        console.log(`Socket ${socket.id} joined room vehicle_${vehicleId}`);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Routes (to be added)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/bids', require('./routes/bidRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
