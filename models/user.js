// Create a model for a user to give it mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const tripSchema = require('./trip');

// Define our model
const userSchema = new Schema({
  email: { type: String, required: true , unique: true, lowercase: true, },
  username: { type: String, required: true , unique: true, lowercase: true, },
  password: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  trips: [tripSchema],
});

// On save hook, encrypt password. Run this function before saving model
userSchema.pre('save', function(next) {
  // Get access to the user model
  const user = this;
  const SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  // Generate a salt then run callback
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);
    // Hash (encrypt) our password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      // Overwrite plain text password with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return callback(err);

    callback(null, isMatch);
  });
}

const ModelClass = mongoose.model('user', userSchema);
module.exports = ModelClass;
