const Contact = require('./schema/contact')

const listContacts = async (userId, { sub, sortBy, sortByDesc, filter, limit = '5', offset = '0', page }) => {
  const results = await Contact.paginate(
    {
      owner: userId,
      subscription: [sub],
    },
    {
      limit,
      // offset,
      page,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {})
      },
      select: filter
        ? filter.split('|').join(' ') ?? '-__v'
        : '-__v',
      populate: {
        path: 'owner',
        select: 'email -_id'
      },
    })
  const { docs: contacts, totalDocs: total } = results
  return { total: total.toString(), limit, offset, page, contacts }
}

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({ _id: contactId, owner: userId }).select('-__v').populate({
    path: 'owner',
    select: 'email -_id'
  })
  return result
}

const removeContact = async (contactId, userId) => {
  const result = await Contact.findOneAndRemove({ _id: contactId, owner: userId })
  return result
}

const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  ).select('-__v')
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
