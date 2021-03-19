const app = require('../app')
const db = require('../model/db')
const createFolderExist = require('../helpers/create-dir')
require('dotenv').config()

const PORT = process.env.PORT || 3000

db.then(() => {
  app.listen(PORT, async () => {
    const UPLOAD_DIR = process.env.UPLOAD_DIR
    const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
    await createFolderExist(UPLOAD_DIR)
    await createFolderExist(AVATARS_OF_USERS)
    console.log(`Server running. Use our API on port: ${PORT}`)
  })
}).catch((err) => {
  console.log(`Server not running. Error message: ${err.massage}`)
  process.exit(1)
})
