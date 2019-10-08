const express = require('express');

const meteoController = require('../controllers/meteoController');

const router = express.Router();

router.get('/weatherdata', meteoController.getWeatherData);
router.post('/weatherdata', meteoController.postWeatherData);

module.exports = router;