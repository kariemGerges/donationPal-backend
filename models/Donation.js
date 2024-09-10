const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create donation Schema

const donationSchema = new Schema({
    _id: {
        type: ObjectId
    },
    campaign_id: {
        type: ObjectId
    },
    user_id:{
        type: ObjectId
    },
    message:{
        type: String,
        require: true
    },
    amount: {
        type: Number
    },
    date: {
        type: Date
    }
});

mongoose.model('donations', donationSchema);