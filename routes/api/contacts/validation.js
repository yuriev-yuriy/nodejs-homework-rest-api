const { optional } = require('joi')
const Joi = require('joi')

const schemaAddContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  phone: Joi.number().integer().positive().required(),
  password: Joi.string().alphanum().min(2).max(30),
  subscription: Joi.string().optional(),
})
const schemaUpdateContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).optional(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).optional(),
  phone: Joi.number().integer().positive().optional(),
  subscription: Joi.string().optional()
}).min(1)

const validate = (schema, obj, next) => {
  const { error } = schema.validate(obj)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: 400,
      message: message
    })
  } next()
}

module.exports.addContact = (req, res, next) => {
  return validate(schemaAddContact, req.body, next)
}

module.exports.updateContact = (req, res, next) => {
  return validate(schemaUpdateContact, req.body, next)
}
