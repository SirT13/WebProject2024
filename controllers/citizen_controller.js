const express = require('express')
const router = express.Router();
const verifyToken  = require('../middleware/auth_middleware');

const { get_citizens } = require('../api/get_citizens')
const { register_citizen } = require('../api/citizen/register_citizen');
const { create_request } = require('../api/citizen/create_request');
const { create_offer } = require('../api/citizen/create_offer');
const { get_requests } = require('../api/citizen/get_requests');
const { get_notifications } = require('../api/citizen/get_notifications');
const { delete_offer } = require('../api/citizen/delete_offer');
const { delete_request } = require('../api/citizen/delete_request');
const { get_offers } = require('../api/citizen/get_offers');

router.route('/get_citizens').get(verifyToken('citizen'),get_citizens)
router.route('/register_citizen').post(verifyToken('citizen'), register_citizen)
router.route('/create_offer').post(verifyToken('citizen'), create_offer)
router.route('/create_request').post(verifyToken('citizen'), create_request)
router.route('/get_requests').get(verifyToken('citizen'),get_requests)
router.route('/get_offers').get(verifyToken('citizen'), get_offers)
router.route('/get_notifications').get(verifyToken('citizen'), get_notifications)
router.route('/delete_request/:id').delete(verifyToken('citizen'), delete_request)
router.route('/delete_offer/:id').delete(verifyToken('citizen'), delete_offer)

module.exports = router;