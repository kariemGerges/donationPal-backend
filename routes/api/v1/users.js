const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
// Models
require('models/User');
const User = mongoose.model('users');
const authenticateJwt = require('middleware/auth');

/* Main route. */
router.get('/', (req, res) => {
    res.json({
        message: `Connected to the server/api/v1/Users`,
        environment: process.env.NODE_ENV === 'production' ? 'Production Mode' : 'Development Mode'
    });
});

// register a new user
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Please enter a valid email'), // validate email
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'), // validate password min length of 8 characters
    ],
    async (req, res) => {
        // validate the input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // check if user email already exists
        const { email, password } =  req.body;
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists' });
            }

        // if not then create a new user
            const user = new User({email, password});
            await user.save();

            res.status(201).json({ 
                message: 'User created successfully',
                user: { id: user._id, email: user.email }
        });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// complete registration
router.post(
    '/register-complete/:id', 
    async (req, res) => {

    try {
    const userId = req.params.id; // get the userId from the URL
    const updateUserInfo = req.body; // get the updated user info from the request body
    console.log(updateUserInfo);
    console.log(userId);

    const updateUser = await User.findByIdAndUpdate(
        userId, 
        { $set: updateUserInfo },
        { new: true, runValidators: true }
    );

    if (!updateUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
        message: 'User updated successfully',
        user: updateUser
    });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
        
});

// login a user
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').exists().withMessage('You Know there should be a password, right?'),
        // body('password').matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).withMessage('Password must contain at least 8 characters, one letter, and one number')

    ],
    async (req, res) => {
        // validate the input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Authenticate user
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user || !(await user.isValidPassword(password))) {
                return res.status(401).json({ error: 'Invalid email or password or both' });
            }

            // create a JWT token
            const payload = { sub : user._id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: '30m',
            });

            // store the token in a cookie
            res.cookie('jwt', token, {
                httpOnly: true,    // Ensures the cookie is not accessible via JavaScript
                secure: false, // testing prod
                // secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS only if the app is deployed in production
                sameSite: 'strict', // Ensures the cookie is only sent with cross-site requests secured
                maxAge: 1000 * 60 * 15, // 15 minutes
            });

            res.status(200).json({
                message: 'User logged in successfully',
                user: { id: user._id, email: user.email },
                // user,
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

// logout a user
router.post('/logout', (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,    // Ensures the cookie is not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS only if the app is deployed in production
        sameSite: 'strict', // Ensures the cookie is only sent with cross-site requests secured
        }
    );
    res.status(200).json({ message: 'User logged out successfully' });
});

// Protected route (get user info)
router.get('/me',
    authenticateJwt,
    async (req, res) => {
        try {
            const userId = req.auth.sub;
            const user = await User.findById(userId).select('-password');
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({
                message: 'User info retrieved successfully',
                user,
                });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

/* Get user by id. */
router.get('/aUser/:id', async(req, res, next) => {
    const { id } = req.params;
    const filter = {"_id" : id};
    try {
        const user = await User.findById(filter);
    res.json( user );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
