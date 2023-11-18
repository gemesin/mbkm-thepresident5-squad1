const express = require('express');
const router = express.Router();
const { getCurrentWeatherController, getWeeklyWeatherController } = require('../controllers/weather.controller');

router.get('/weather/current', getCurrentWeatherController);
router.get('/weather/weekly', getWeeklyWeatherController);

module.exports = router;