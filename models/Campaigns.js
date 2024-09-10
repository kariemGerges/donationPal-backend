const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema

const campaignsSchema = new Schema({
    _id:{
        type: ObjectId
    },
    name:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    goal:{
        type: Number,
        require: true
    },
    start_date:{
        type: Date,
        require: true
    },
    end_date:{
        type: Date,
        require: true
    },
    currentAmount:{
        type: Number
    }
    
});

mongoose.model('campaigns', campaignsSchema);
