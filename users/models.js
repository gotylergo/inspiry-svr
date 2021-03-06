'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: '/img/user.png'
  }
});

UserSchema.methods.serialize = function () {
  return {
    username: this.username || '',
    name: this.name || '',
    avatar: '/img/user.png'
  };
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
