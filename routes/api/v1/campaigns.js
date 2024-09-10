const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Models
require('models/Campaigns');
const Campaigns = mongoose.model('campaigns');

/* Main route. */
router.get('/', (req, res, next) =>{
    res.send(`
        <h1>Connected to the server/api/v1/campaigns</h1>
        ${process.env.NODE_ENV === 'production' ? 
            '<h2>Production Mode</h2>' :
            '<h2>Development Mode</h2>'
        }
        `);
});

/* GET all campaigns. */
router.get('/allCampaigns', async(req, res, next) => {
    const filter = {};
    try {
        const campaigns = await Campaigns.find(filter);
    res.json( campaigns );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/* GET single campaign. */
// example : http://localhost:3000/campaigns/campaign/63d2a455b06aae132e00ee6e
router.get('/campaign/:id', async(req, res, next) => {
    const { id } = req.params;
    const filter = { _id: id };
    const campaign = await Campaigns.find(filter);
    res.json( campaign );
});


module.exports = router;
