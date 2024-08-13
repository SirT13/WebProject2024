const express = require('express')
const router = express.Router();
const verifyToken  = require('../middleware/auth_middleware');

const { get_citizens } = require('../api/get_citizens')
const { register_citizen } = require('../api/citizen/register_citizen');
const { create_task } = require('../api/citizen/create_task');

router.route('/get_citizens').get(verifyToken('citizen'),get_citizens)
router.route('/register_citizen').post(register_citizen)
router.route('/create_task').post(create_task)

module.exports = router;