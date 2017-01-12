const passport = require('passport');
const passportService = require('./services/passport');
const authentication = require('./controllers/authentication');
const trips = require('./controllers/trips')
const activities = require('./controllers/activities');
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // Authentication Routes
  app.post('/signin', requireSignin, authentication.signin);
  app.post('/signup', authentication.signup);
  app.post('/forgot', authentication.forgot);
  app.post('/reset/:token', authentication.reset);

  // Trip Routes
  app.get('/user/:username', requireAuth, trips.showAll);
  app.post('/user/:username', requireAuth, trips.create);
  app.put('/user/:username/trip/:tripId', requireAuth, trips.update);
  app.delete('/user/:username/trip/:tripId', requireAuth, trips.delete);

  // Activity Routes
  app.get('/user/:username/trip/:tripId', requireAuth, activities.showAll);
  app.post('/user/:username/trip/:tripId', requireAuth, activities.create);
  app.put('/user/:username/trip/:tripId/activity/:activityId', requireAuth, activities.update);
  app.delete('/user/:username/trip/:tripId/activity/:activityId', requireAuth, activities.delete);
}
