const express = require('express')
const app = express()
const port = 3000
const civilian_controller = require('./controllers/civilian_controller.js')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',civilian_controller)

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})