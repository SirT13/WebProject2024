const express = require('express')
const multer = require('multer');
const verifyToken  = require('../middleware/auth_middleware');

const router = express.Router();

const { update_warehouse } = require('../api/admin/update_warehouse')
const { upload_file } = require('../api/admin/upload_file')
const { register_admin } = require('../api/admin/register_admin')
const { register_rescuer } = require('../api/admin/register_rescuer')
const { get_tasks } = require('../api/admin/get_tasks')
const upload = multer({ dest: 'uploads/' });

router.route('/update_warehouse').get(verifyToken('admin'),update_warehouse)
router.route('/upload_file').post(verifyToken('admin'),upload.single('file'),upload_file)
router.route('/register_admin').post(register_admin)
router.route('/register_rescuer').post(verifyToken('admin'),register_rescuer)
router.route('/get_tasks').get(verifyToken('admin'),get_tasks)

module.exports = router;