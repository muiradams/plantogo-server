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

  // Trip Routes TODO: should I add requireAuth as middleware?
  app.get('/user/:username', trips.showAll);
  app.post('/user/:username', trips.create);
  app.put('/user/:username/trip/:tripName', trips.update);
  app.delete('/user/:username/trip/:tripName', trips.delete);

  // Activity Routes TODO: should I add requireAuth as middleware?
  app.get('/user/:username/trip/:tripName', activities.showAll);
  app.post('/user/:username/trip/:tripName', activities.create);
  app.post('/user/:username/trip/:tripName/activity/:id', activities.update);
  app.post('/user/:username/trip/:tripName/activity/:id', activities.delete);
}
