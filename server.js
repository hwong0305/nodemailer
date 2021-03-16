const nodeMailin = require('node-mailin')
const fs = require('fs')
const path = require('path')

const express = require('express')
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('public'))

nodeMailin.start({
  port: 25,
})

let mapping = []

fs.readFile(path.join(__dirname, 'data.db'), (err, data) => {
  if (err) {
    return console.log('No existing file')
  }
  mapping = JSON.parse(data)
})

nodeMailin.on('message', function (connection, data, content) {
  const id = Date.now()

  const map = {
    path: `/notes/${id}.json`,
    sender: data.from.value[0].address,
    to: data.to.value[0].address,
    text: data.text,
    textAsHtml: data.textAsHtml,
    html: data.html,
    attachments: data.attachments,
  }

  mapping.push(map)

  fs.promises
    .writeFile(path.join(__dirname, 'data.db'), JSON.stringify(mapping))
    .then(() => {
      fs.promises
        .writeFile(
          path.join(__dirname, 'notes', `${id}.json`),
          JSON.stringify(data)
        )
        .catch((err) => {
          if (err.code === 'ENOENT') {
            fs.promises.mkdir(path.join(__dirname, 'notes')).then(() => {
              fs.promises.writeFile(
                path.join(__dirname, 'notes', `${id}.json`),
                JSON.stringify(data)
              )
            })
          }
        })
    })
    .catch((err) => {
      console.log('Error:', err)
    })
})

nodeMailin.on('error', function (error) {
  console.log('Error:', error)
})

app.get('/', (req, res) => {
  res.render('dash')
})

app.get('/api/mapping', (req, res) => {
  res.json(mapping)
})

app.listen(5050, () => {
  console.log('Now listening on Port 5050')
})
