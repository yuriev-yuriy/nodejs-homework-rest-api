const mongoose = require('mongoose')
const { Schema, model, SchemaTypes } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')
const { Sub } = require('../../helpers/constants')

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
    enum: { values: [Sub.FREE, Sub.PRO, Sub.PREMIUM] },
    default: Sub.FREE
  },
  // password: {
  //   type: String,
  //   required: [true, 'Set contact number'],
  // },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
  }
}, { timestamps: true })

contactSchema.plugin(mongoosePaginate)
const Contact = model('contact', contactSchema)

module.exports = Contact
