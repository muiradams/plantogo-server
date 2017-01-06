// Create a model for a trip's activities
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
module.exports = new Schema({
  activityName: String,
  activityType: String,
  startTime: Date,
  endTime: Date,
  notes: String,
});
