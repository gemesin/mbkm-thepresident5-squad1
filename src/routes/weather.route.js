const express = require('express');
const router = express.Router();
const { getCurrentWeatherController, getWeeklyWeatherController } = require('../controllers/weather.controller');

router.get('/current/:latitude/:longitude', getCurrentWeatherController);
router.get('/weekly/:latitude/:longitude', getWeeklyWeatherController);

module.exports = router;