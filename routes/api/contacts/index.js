const express = require('express')
const router = express.Router()
const contactsController = require('../../../controllers/contacts')
const validate = require('./validation')
const guard = require('../../../helpers/guard')

router
  .get('/', guard, contactsController.listContacts)
  .post('/', guard, validate.addContact, contactsController.addContact)

router
  .get('/:contactId', guard, contactsController.getContactById)
  .delete('/:contactId', guard, contactsController.removeContact)
  .patch('/:contactId', guard, validate.updateContact, contactsController.updateContact)

module.exports = router
