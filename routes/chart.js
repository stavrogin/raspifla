const express = require('express');

const chartController = require('../controllers/chartController');

const router = express.Router();

router.get('/', chartController.getChartView);

module.exports = router;