const Contacts = require('../model/contacts')

const listContacts = async (req, res, next) => {
  try {
    console.log(req)
    const userId = req.user.id
    const contacts = await Contacts.listContacts(userId, req.query)
    return res.json({
      status: 'success',
      code: 200,
      data: {
        ...contacts,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.getContactById(req.params.contactId, userId)
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
    const userId = req.user.id
    const contact = await Contacts.addContact({ ...req.body, owner: userId })
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
    const userId = req.user.id
    const contact = await Contacts.removeContact(req.params.contactId, userId)
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
    const userId = req.user.id
    const contact = await Contacts.updateContact(req.params.contactId, req.body, userId)
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
