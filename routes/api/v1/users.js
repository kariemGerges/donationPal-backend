const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
require('models/User');
const User = mongoose.model('users');

/* Main route. */
router.get('/', (req, res, next) =>{
    res.send(`
        <h1>Connected to the server/api/v1/Users</h1>
        ${process.env.NODE_ENV === 'production' ? 
            '<h2>Production Mode</h2>' :
            '<h2>Development Mode</h2>'
        }
        `);
    });

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
