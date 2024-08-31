const express = require('express')
const router = express.Router();
const verifyToken  = require('../middleware/auth_middleware');

const { update_task_status } = require('../api/rescuer/update_task_status')
const { assign_task } = require('../api/rescuer/assign_task')
const { get_rescuer_map_info } = require('../api/rescuer/get_rescuer_map_info')
const { save_rescuer_location } = require('../api/rescuer/save_rescuer_location')

router.route('/update_task_status').post(verifyToken('rescuer'),update_task_status)
router.route('/assign_task').put(verifyToken('rescuer'),assign_task)
router.route('/get_rescuer_map_info').get(verifyToken('rescuer'),get_rescuer_map_info)
router.route('/save_rescuer_location').post(verifyToken('rescuer'),save_rescuer_location)

module.exports = router;