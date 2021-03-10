const Contacts = require('../model/contacts')

const listContacts = async (req, res, next) => {
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
}

const getContactById = async (req, res, next) => {
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
}

const addContact = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body)
    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact,
      },
    })
  } catch (err) {
    next(err)
  }
}

const removeContact = async (req, res, next) => {
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
}

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
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
}

module.exports = { listContacts, getContactById, addContact, removeContact, updateContact }
