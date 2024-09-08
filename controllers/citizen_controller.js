const express = require('express')
const router = express.Router();
const verifyToken  = require('../middleware/auth_middleware');

const { get_citizens } = require('../api/get_citizens')
const { register_citizen } = require('../api/citizen/register_citizen');
const { create_request } = require('../api/citizen/create_request');
const { create_offer } = require('../api/citizen/create_offer');
const { get_requests } = require('../api/citizen/get_requests');
const { get_notifications } = require('../api/citizen/get_notifications');
const { delete_request } = require('../api/citizen/delete_offer');

router.route('/get_citizens').get(verifyToken('citizen'),get_citizens)
router.route('/register_citizen').post(register_citizen)
router.route('/create_offer').post(create_offer)
router.route('/create_request').post(create_request)
router.route('/get_requests').get(get_requests)
router.route('/get_notifications').get(get_notifications)
router.route('/delete_request/:id').delete(delete_request)

module.exports = router;