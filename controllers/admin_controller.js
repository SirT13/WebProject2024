const express = require('express')
const multer = require('multer');
const verifyToken  = require('../middleware/auth_middleware');

const router = express.Router();

const { update_warehouse } = require('../api/admin/update_warehouse')
const { upload_file } = require('../api/admin/upload_file')
const { register_admin } = require('../api/admin/register_admin')
const { register_rescuer } = require('../api/admin/register_rescuer')
const { get_tasks } = require('../api/admin/get_tasks')
const { get_items } = require('../api/admin/get_items')
const { get_vehicles } = require('../api/admin/get_vehicles')
const { get_rescuers } = require('../api/admin/get_rescuers')
const { add_category } = require('../api/admin/add_category')
const { add_vehicle } = require('../api/admin/add_vehicle')
const { update_item_quantity } = require('../api/admin/update_item_quantity')
const { get_warehouse_location } = require('../api/admin/get_warehouse_location')
const { get_admin_map_info } = require('../api/admin/get_admin_map_info')
const { save_warehouse_location } = require('../api/admin/save_warehouse_location')
const { create_notification } = require('../api/admin/create_notification')
const upload = multer({ dest: 'api/uploads/' });

router.route('/update_warehouse').get(verifyToken('admin'),update_warehouse)
router.route('/upload_file').post(verifyToken('admin'),upload.single('file'),upload_file)
router.route('/register_admin').post(register_admin)
router.route('/register_rescuer').post(verifyToken('admin'),register_rescuer)
router.route('/get_rescuers').get(verifyToken('admin'),get_rescuers)
router.route('/get_tasks').get(verifyToken('admin'),get_tasks)
router.route('/get_items').get(get_items)
router.route('/get_vehicles').get(verifyToken('admin'),get_vehicles)
router.route('/add_category').post(verifyToken('admin'),add_category)
router.route('/add_vehicle').post(verifyToken('admin'),add_vehicle)
router.route('/get_warehouse_location').get(get_warehouse_location)
router.route('/get_admin_map_info').get(verifyToken('admin'),get_admin_map_info)
router.route('/save_warehouse_location').post(verifyToken('admin'),save_warehouse_location)
router.route('/create_notification').post(create_notification)
router.route('/update_item_quantity').put(verifyToken('admin'),update_item_quantity)

module.exports = router;    