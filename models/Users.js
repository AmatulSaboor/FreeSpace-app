const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail, isMobilePhone} = require('validator');

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: [true, 'email already exist'],
      minlength: [3, 'Username must be 3 or more characters'],
      maxlength: [19, 'Username must be under 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'email already exist'],
      lowercase: true,
      validate: [isEmail, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [6, 'Phone must be 6 or more characters'],
      unique: [true, 'Phone number already taken by another user'],
      validate: [isMobilePhone, 'Number entered is not a valid phone number']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be 6 or more characters'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Confirm password is required'],
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);
module.exports = mongoose.model('User', UserSchema );
