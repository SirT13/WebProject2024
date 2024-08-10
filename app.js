const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 3000
const bodyParser = require('body-parser');

const citizen = require('./controllers/citizen_controller')
const db = require('./services/connect_db')
const dotenv = require('dotenv');
const login = require('./controllers/login_controller')
dotenv.config();

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/api',citizen)
app.use('/auth',login)
app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})