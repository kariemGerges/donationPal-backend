require('dotenv').config();
require('app-module-path').addPath(__dirname);
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');

const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');


// Routes
const indexRouter = require('./routes/api/v1/index');
const campaignsRouter = require('./routes/api/v1/campaigns');
const donationsRouter = require('./routes/api/v1/donations');
const usersRouter = require('./routes/api/v1/users');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configure the rate limiter
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    // origin: 'http://localhost:3001',
    origin: 'https://kariemgerges.github.io',
    credentials: true
}));
app.use(limiter);
app.use(helmet());

// Routes
app.use('/api', indexRouter);
app.use('/campaigns', campaignsRouter);
app.use('/donations', donationsRouter);
app.use('/users', usersRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
        if (err.name === 'UnauthorizedError') {
        // Handle JWT authentication errors
            res.status(401).json({ message: 'Invalid token' });
        } else {
            next(err);
        }
    });

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
.then(() => {
    console.log('Connected to MongoDB');
    const setupChangeStream = require('./models/changeStream');
    setupChangeStream(io);
})
.catch(err => console.log(err));

// WebSocket setup
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

module.exports = { app, server, io };
