const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: Number,
    required: true,
    //unique: true,
  },
  otp:
  {
    type: Number,
    required: true,
  },
  chatHistory: [
    conversation = {    
      id: { type: Number, required: true },
    messages: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      },
    ],
  }
  ],
  queryCounter: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;