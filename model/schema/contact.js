const mongoose = require('mongoose')
const { Schema, model } = mongoose

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
})

const Contact = model('contact', contactSchema)

module.exports = Contact
