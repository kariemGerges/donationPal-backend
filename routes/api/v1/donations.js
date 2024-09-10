const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Models
require('models/Donation');
const Donation = mongoose.model('donations');


// Main route
router.get('/', (req, res, next) =>{
    res.send(`
        <h1>Connected to the server/api/v1/donations</h1>
        ${process.env.NODE_ENV === 'production' ? 
            '<h2>Production Mode</h2>' :
            '<h2>Development Mode</h2>'
        }
        `);
});


// GET all donations
router.get('/allDonations', async(req, res, next) => {
    const filter = {};
    const allDonations = await Donation.find(filter);
res.json( {allDonations} );
});

// get all donation by id user or campaign
// get all donation done for a campaign id
router.get('/donationForCampaign/:id', async(req, res, next) => {
    const filter = {"campaign_id" : req.params.id};
    const donationsById = await Donation.find(filter);
    res.json({ donationsById });
});

// get all donation done by a user id
router.get('/donationByUser/:id', async(req, res, next) => {
    const filter = {"user_id" : req.params.id};
    const donationsByCampaign = await Donation.find(filter);
    res.json({ donationsByCampaign });
});

// search by donation amount
router.get('/donationByAmount/:amount', async(req, res, next) => {
    const filter = {"amount" : req.params.amount};
    const donationsByAmount = await Donation.find(filter);
    res.json({ donationsByAmount });
});


module.exports = router;