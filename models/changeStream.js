const mongoose = require('mongoose');
const Campaigns = require('./Campaigns');

const setupChangeStream = (io) => {
  if (mongoose.connection.readyState === 1) {
    const changeStream = mongoose.connection.watch();

    changeStream.on('change', (change) => {
      console.log('Change detected:', change);
      io.emit('dataUpdated', change);
    });

    changeStream.on('error', (error) => {
      console.error('Change Stream Error:', error);
    });
  } else {
    console.error('MongoDB connection is not ready');
  }
};

module.exports = setupChangeStream;