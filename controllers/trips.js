const User = require('../models/user');

// Show all trips for a user
exports.showAll = function(req, res, next) {
  const username = req.params.username;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Create a new trip list that only contains the trip names and dates
    const allTrips = user.trips.map(function(trip) {
      return { tripName: trip.tripName, tripDate: trip.activities[0].startTime, };
    });

    res.send(allTrips);
  });
}

// Create a new trip
exports.create = function(req, res, next) {
  const username = req.params.username;
  const tripName = req.body.tripName;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Create a new trip list that only contains the trip names and dates
    const newTrip = { tripName: tripName, activities: [] };
    user.trips.push(newTrip);

    user.save(function(err){
      if (err) { return next(err); }
    });
  });
}

// Update the name of a trip
exports.update = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}

// Delete a trip
exports.delete = function(req, res, next) {
  res.send({ token: tokenForUser(req.user) });
}
