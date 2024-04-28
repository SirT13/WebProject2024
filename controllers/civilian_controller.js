const express = require('express')
const router = express.Router();

const { civilian } = require('../api/civilian')

router.route('/greet_civilian').get(civilian)

module.exports = router;