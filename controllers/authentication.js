const jwt = require('jwt-simple');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const exampleTrip = require('../models/exampleTrip');

// SETUP
// Hide this if using config variables in production
// const config = require('../config');
// Unhide this if using config variables in production
const config = { secret: null, mailgunLogin: null, mailgunPassword: null};
// END SETUP

const SECRET = process.env.SECRET || config.secret;
const MAILGUNLOGIN = process.env.MAILGUNLOGIN || config.mailgunLogin;
const MAILGUNPASSWORD = process.env.MAILGUNPASSWORD || config.mailgunPassword;

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, SECRET);
}

exports.signin = function(req, res, next) {
  // User has already been authenticated through middleware, now give them a token
  res.send({ token: tokenForUser(req.user) });
}

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !username || !password) {
    return res.status(422).send({ error: 'Must provide Email, Username, and Password'});
  }

  // See if a user with given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error
    if(existingUser) {
      return res.status(422).send({ error: 'Email already in use' });
    }

    // See if a user with given username exists
    User.findOne({ username: username }, function(err, existingUser) {
      if (err) { return next(err); }

      // If a user with username does exist, return an error
      if(existingUser) {
        return res.status(422).send({ error: 'Username already in use' });
      }

      // If a user with email and username does not exist, create and save user record
      const user = new User({
        email: email,
        username: username,
        password: password,
        trips: [exampleTrip],
      });

      user.save(function(err){
        if (err) { return next(err); }

        // Respond to request indicating the user was created
        res.json({ token: tokenForUser(user) });
      });
    });
  });
}

exports.forgot = function(req, res, next) {
  crypto.randomBytes(20, function(err, buf) {
    if (err) { return next(err); }

    var token = buf.toString('hex');

    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) { return next(err); }

      if (!user) {
        return res.status(422).send({ error: 'No account with that email exists'});
      }

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      user.save(function(err) {
        if (err) { return next(err); }

        var smtpTransport = nodemailer.createTransport('SMTP', {
          service: 'Mailgun',
          auth: {
            user: MAILGUNLOGIN,
            pass: MAILGUNPASSWORD,
          }
        });

        var mailOptions = {
          to: user.email,
          from: 'passwordreset@plantogo.com',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you requested a reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
//            'https://' + req.headers.host + '/reset/' + token + '\n\n' +
            'http://localhost:8080/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };

        smtpTransport.sendMail(mailOptions, function(err) {
          if (err) { return next(err); }

          res.status(200).send({message: `Email sent to ${user.email}`});
        });
      });
    });
  });
}

exports.reset = function(req, res, next) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (err) { return next(err); }

    if (!user) {
      return res.status(422).send({ error: 'No account with that email exists'});
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.save(function(err) {
      if (err) { return next(err); }

      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'Mailgun',
        auth: {
          user: MAILGUNLOGIN,
          pass: MAILGUNPASSWORD,
        }
      });

      var mailOptions = {
        to: user.email,
        from: 'passwordreset@plantogo.co',
        subject: 'Your password has been changed',
        text: `Hello ${user.username},\n\nThis is confirmation that the password for your account, ${user.email}, has just been changed.\n`
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        if (err) { return next(err); }

        res.status(200).send({message: `Password successfully changed`});
      });
    });
  });
}
