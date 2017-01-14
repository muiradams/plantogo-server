const User = require('../models/user');

// Show all activities for a trip
exports.showAll = function(req, res, next) {
  const username = req.params.username;
  const tripId = req.params.tripId;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Find the trip
    const trip = user.trips.id(tripId);

    // Does the trip exist? If not, send an error
    if (!trip) {
      return res.status(422).send({ error: 'Trip does not exist' });
    }

    // res.send(allTrips);
    res.status(200).json(trip);
  });
}

// Create a new activity
exports.create = function(req, res, next) {
  const username = req.params.username;
  const tripId = req.params.tripId;
  // activityFields should represent all of the fields in the activity model
  const activityFields = {
    activityName,
    activityType,
    start,
    end,
    notes,
  } = req.body;

  if (!activityName || !activityType || !start ) {
    return res.status(422).send({
      error: 'You must provide a name, type and start time to create a new activity'
    });
  }

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Find the trip
    const trip = user.trips.id(tripId);

    // Does the trip exist?  If not, return an error
    if(!trip) {
      return res.status(422).send({ error: 'Trip does not exist' });
    }

    trip.activities.push(activityFields);

    user.save(function(err){
      if (err) { return next(err); }

      res.status(201).end();
    });
  });
}

// Show one activity
exports.show = function(req, res, next) {
  const username = req.params.username;
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Find the trip
    const trip = user.trips.id(tripId);

    // Does the trip exist?  If not, return an error
    if(!trip) {
      return res.status(422).send({ error: 'Trip does not exist' });
    }

    // Find the activity
    const activity = trip.activities.id(activityId);

    // Does the activity exist?  If not, return an error
    if(!activity) {
      return res.status(422).send({ error: 'Activity does not exist' });
    }

    // Return the activity
    res.status(200).json(activity);
  });
}

// Update an activity
exports.update = function(req, res, next) {
  const username = req.params.username;
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;
  // activityFields should represent all of the fields in the activity model
  const activityFields = {
    activityName,
    activityType,
    start,
    end,
    notes,
  } = req.body;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Find the trip
    const trip = user.trips.id(tripId);

    // Does the trip exist?  If not, return an error
    if(!trip) {
      return res.status(422).send({ error: 'Trip does not exist' });
    }

    // Find the activity
    const activity = trip.activities.id(activityId);

    // Does the activity exist?  If not, return an error
    if(!activity) {
      return res.status(422).send({ error: 'Activity does not exist' });
    }

    // Update the data in each of the activity fields
    for (var field in activityFields) {
      const newData = activityFields[field];
      if (newData) {
        activity[field] = newData;
      }
    }

    user.save(function(err){
      if (err) { return next(err); }
      res.status(200).end();
    });
  });
}

// Delete an activity
exports.delete = function(req, res, next) {
  const username = req.params.username;
  const tripId = req.params.tripId;
  const activityId = req.params.activityId;

  User.findOne({ username: username }, function(err, user) {
    if (err) { return next(err); }

    // If a user with username does not exist, return an error
    if(!user) {
      return res.status(422).send({ error: 'User does not exist' });
    }

    // Find the trip
    const trip = user.trips.id(tripId);

    // Does the trip exist? If not, send an error
    if(!trip) {
      return res.status(422).send({ error: 'Trip does not exist' });
    }

    // Does the activity exist? If not, send an error
    if(!trip.activities.id(activityId)) {
      return res.status(422).send({ error: 'Activity does not exist' });
    }

    trip.activities.pull(activityId);

    user.save(function(err){
      if (err) { return next(err); }
      res.status(200).end();
    });
  });
}
