// Create a model for a trip's activities
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
module.exports = new Schema({
  activityName: String,
  activityType: String,
  start: Date,
  end: Date,
  startLocation: String,
  endLocation: String,
  address: String,
  confirmationNumber: String,
  transportNumber: String,
  notes: String,
});
