const passport = require('passport');
const User = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// SETUP
// Hide this if using config variables in production
// const config = require('../config');
// Unhide this if using config variables in production
 const config = { secret: null };
// END SETUP

const SECRET = process.env.SECRET || config.secret;

// Create local strategy
const localOptions = { usernameField: 'username' };
const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
  // Verify this username and password, call done with the user if it is the
  // correct username and password, otherwise call done with false
  User.findOne({ username: username }, function(err, user) {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username' });

    // Compare passwords - is 'password' equal to user.password
    user.comparePassword(password, function(err, isMatch) {
      if (err) return done(err);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    });
  });
});

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: SECRET,
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in our database
  // if it does, call 'done' with that object, else call done w/o a user object
  User.findById(payload.sub, function(err, user) {
    if (err) return done(err, false);

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

// Tell passport to use these strategies
passport.use(jwtLogin);
passport.use(localLogin);
