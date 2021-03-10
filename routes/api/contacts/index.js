const express = require('express')
const router = express.Router()
const contactsController = require('../../../controllers/contacts')
const validate = require('./validation')

router
  .get('/', contactsController.listContacts)
  .post('/', validate.addContact, contactsController.addContact)

router
  .get('/:contactId', contactsController.getContactById)
  .delete('/:contactId', contactsController.removeContact)
  .patch('/:contactId', validate.updateContact, contactsController.updateContact)

module.exports = router
