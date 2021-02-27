const fs = require('fs/promises')
const path = require('path')
const { v4: uuid } = require('uuid')
// const db = require('./db')
// const contacts = require('./contacts.json')

const contactsPath = path.join(__dirname, './contacts.json')

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: 'utf8' })
    const parsedData = JSON.parse(data)
    return parsedData
  } catch (error) {
    console.error(error.message)
    process.exit(ExitCode.error)
  }
}

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: 'utf8' })
    const parsedData = JSON.parse(data)
    const findedContact = parsedData.find(cnt => contactId.length > 1 ? cnt.id === contactId : cnt.id == contactId)
    return findedContact
  } catch (err) {
    console.error(err.message)
  }
}

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: 'utf8' })
    const parsedData = JSON.parse(data)
    const index = parsedData.findIndex(elem => elem.id == contactId)
    const deletedContact = parsedData.splice(index, 1)
    await fs.writeFile(contactsPath, JSON.stringify(parsedData, null, 2), { encoding: 'utf-8' })
    return deletedContact
  } catch (err) {
    console.error(err.message)
  }
}

const addContact = async (body) => {
  try {
    const id = uuid()
    const record = {
      id, ...body
    }
    const data = await fs.readFile(contactsPath, { encoding: 'utf8' })
    const parsedData = JSON.parse(data)
    const newList = [...parsedData, record]
    await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2), { encoding: 'utf8' })
    return record
  } catch (err) {
    console.error(err.message)
  }
}

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath, { encoding: 'utf8' })
    const parsedData = JSON.parse(data)
    const index = parsedData.findIndex(elem => elem.id == contactId)
    const updCnt = { ...parsedData[index], ...body }
    parsedData.splice(index, 1, updCnt)
    await fs.writeFile(contactsPath, JSON.stringify(parsedData, null, 2), { encoding: 'utf8' })
    return updCnt
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
