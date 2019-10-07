const path = require('path');
const express = require('express');

const adminController = require('../controllers/adminController');

const router = express.Router();

// /admin/add-product => GET
router.get('/version', adminController.getVersion);

module.exports = router;