const express = require('express')
const router = express.Router()
const Contacts = require('../../model/index')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()
    return res.json({
      status: 'success',
      code: 200,
      data: {
        contacts,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact
        }
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        body: { message: 'Contact not found' },
      })
    }
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body)
    return res.json({
      status: 'success',
      code: 201,
      data: {
        contact,
      },
    })
  } catch (err) {
    next(err)
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact
        }
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: {
          message: 'contact not found'
        }
      })
    }
  } catch (err) {
    next(err)
  }
})

router.patch('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact
        }
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: { message: 'Not found' }
      })
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
