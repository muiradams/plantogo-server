// Create a model for a user's trips
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const activitySchema = require('./activity');

// Define our model
module.exports = new Schema({
  tripName: String,
  activities: [activitySchema],
});
