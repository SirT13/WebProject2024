const express = require('express')
const router = express.Router();
const verifyToken  = require('../middleware/auth_middleware');

const { complete_task } = require('../api/rescuer/complete_task')

router.route('/complete_task').post(verifyToken('rescuer'),complete_task)

module.exports = router;