const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
  // user has already been authenticated, now give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !username || !password) {
    return res.status(422).send({ error: 'You must provide Email, Username, and Password'});
  }

  // see if a user with given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // if a user with email does exist, return an error
    if(existingUser) {
      return res.status(422).send({ error: 'Email is already in use' });
    }

    // see if a user with given username exists
    User.findOne({ username: username }, function(err, existingUser) {
      if (err) { return next(err); }

      // if a user with username does exist, return an error
      if(existingUser) {
        return res.status(422).send({ error: 'Username is already in use' });
      }

      // if a user with email and username does not exist, create and save user record
      const user = new User({
        email: email,
        username: username,
        password: password,
      });

      user.save(function(err){
        if (err) { return next(err); }

        // respond to request indicating the user was created
        res.json({ token: tokenForUser(user) });
      });
    });
  });
}
