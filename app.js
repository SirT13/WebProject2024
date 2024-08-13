const express = require('express')
const app = express()
const port = process.env.SERVER_PORT || 3000
const bodyParser = require('body-parser');
const path = require('path');

const db = require('./utils/connect_db')
const dotenv = require('dotenv');

const login = require('./controllers/login_controller')
const admin = require('./controllers/admin_controller')
const citizen = require('./controllers/citizen_controller')
const rescuer = require('./controllers/rescuer_controller')
dotenv.config();

app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/admin',admin)
app.use('/api',citizen,rescuer)
app.use('/auth',login)
app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})