const express = require('express')
const router = express.Router();
const verifyToken  = require('../middleware/auth_middleware');

const { get_citizens } = require('../api/get_citizens')
const { register_citizen } = require('../api/register_citizen');

router.route('/get_citizens').get(verifyToken,get_citizens)
router.route('/register_citizen').post(register_citizen)

module.exports = router;