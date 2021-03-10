const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set contact name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Set contact email'],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, 'Set contact number'],
    unique: true,
  },
  subscription: {
    type: String,
    message: ['free' || 'pro' || 'premium'],
    default: 'free',
  },
  password: {
    type: String,
    required: [true, 'Set contact number'],
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  }
}, { timestamps: true })

const Contact = model('contact', contactSchema)

module.exports = Contact
