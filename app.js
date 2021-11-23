const express = require('express')
const Route = require('./route-handler/route')

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/', function (req, res) {
  Route.sendWhatsappMessageToConnect(req)
  res.sendStatus(204)
})

app.post('/status-callback', function (req, res) {
  res.sendStatus(204)
})

app.get('/', function (req, res) {
  res.send('I am alive :)')
})

module.exports = app
