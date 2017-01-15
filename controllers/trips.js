const User = require('../models/user');

// Show all trips for a user
exports.showAll = function(req, res, next) {
  const username = req.params.username;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    res.status(200).json(user.trips);
  });
}

// Create a new trip
exports.create = function(req, res, next) {
  const username = req.params.username;
  const tripName = req.body.tripName;

  if (!tripName) {
    return res.status(422).send({ error: 'You must provide a name for the Trip'});
  }

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Create a new trip that only contains the tripName
    const newTrip = { tripName, activities: [], };
    user.trips.push(newTrip);

    user.save(function(err, updatedUser){
      if (err) { return next(err); }
      const tripId = updatedUser.trips[updatedUser.trips.length - 1]._id;
      res.status(201).send({ tripId });
    });
  });
}

// Update the name of a trip
exports.update = function(req, res, next) {
  const username = req.params.username;
  const tripId = req.params.tripId;
  const tripName = req.body.tripName;

  if (!tripName) {
    return res.status(422).send({ error: 'You must provide a name for the Trip'});
  }

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Find the user's trip
    const trip = user.trips.id(tripId);

    // Does the trip exist?
    if(!trip) {
      return res.status(422).send({ error: 'Trip does not exist' });
    }

    // Update the trip name
    trip.tripName = tripName;

    user.save(function(err){
      if (err) { return next(err); }
      res.status(200).end();
    });
  });
}

// Delete a trip
exports.delete = function(req, res, next) {
  const username = req.params.username;
  const tripId = req.params.tripId;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Does the trip exist?  If not, send an error
    if(!user.trips.id(tripId)) {
      return res.status(422).send({ error: 'Trip does not exist' });
    }

    user.trips.pull(tripId);

    user.save(function(err){
      if (err) { return next(err); }
      res.status(200).end();
    });
  });
}
