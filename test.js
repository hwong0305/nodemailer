const fs = require('fs')
const path = require('path')

const users = {
  username: 'x3hally',
  name: 'Hally',
  lastName: 'Hong',
}

fs.promises
  .writeFile(path.join(__dirname, 'notes', 'user.db'), JSON.stringify(users))
  .catch((err) => {
    if (err.code === 'ENOENT') {
      fs.promises
        .mkdir(path.join(__dirname, 'notes'))
        .then(() => {
          fs.promises.writeFile(
            path.join(__dirname, 'notes', 'user.db'),
            JSON.stringify(users)
          )
        })
        .catch((err) => {
          throw err
        })
    } else {
      console.error(err)
    }
  })
