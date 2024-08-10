const express = require('express')
const router = express.Router();

const { login } = require('../api/login')

router.route('/login').post(login)

module.exports = router;