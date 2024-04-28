const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 3000
const bodyParser = require('body-parser');

const civilian_controller = require('./controllers/civilian_controller')
const db = require('./services/connect_db')
const dotenv = require('dotenv');
const login = require('./identity_server/controllers/login_controller')
dotenv.config();

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',civilian_controller)
app.use('/auth',login)
app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})