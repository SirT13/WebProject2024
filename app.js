const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 3000

const civilian_controller = require('./controllers/civilian_controller')
const db = require('./services/connect_db')
const dotenv = require('dotenv');
dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',civilian_controller)

app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})