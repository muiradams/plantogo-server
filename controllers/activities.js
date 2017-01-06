const User = require('../models/user');

// Show all activities for a trip
exports.showAll = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}

// Create a new activity
exports.create = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}

// Update an activity
exports.update = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}

// Delete an activity
exports.delete = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}
