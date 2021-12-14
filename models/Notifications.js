const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isEmail} = require('validator');

const NotificationSchema = new Schema(
  {
    senderName: {
      type: String,
      required: [true, 'Sender name is required'],
      minlength: [3, 'Sender name must be 3 or more characters'],
      maxlength: [19, 'Sender name must be under 20 characters'],
    },
    senderEmail: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      validate: [isEmail, 'Please send a valid email address'],
    },
    senderPhone: {
      type: String,
    //   required: [true, 'Phone number is required'],
    },
    recieverName: {
        type: String,
        required: [true, 'Reciever name is required'],
        minlength: [3, 'Reciever name must be 3 or more characters'],
        maxlength: [19, 'Reciever name must be under 20 characters'],
    },
    isRead: {
        type: Boolean,
        required: [true, 'IsRead is required'],
    },
    postId:{
        type: String,
        required : [true, 'Post Id is Required']
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);
module.exports = mongoose.model('Notifications', NotificationSchema );
