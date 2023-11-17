const express = require('express');
const weather = require('../models/weather.model');

async function getCurrentWeatherController(req, res) {
  const { latitude, longitude } = req.params;

  try {
    const apiKey = '46c6c92b227b811959df28fc16e0e637';
    const currentWeatherEndpoint = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const response = await weather(currentWeatherEndpoint);
    const currentWeatherData = await response.json();

    const currentWeather = {
      temperature: currentWeatherData.main.temp,
      description: currentWeatherData.weather[0].description,
      icon: currentWeatherData.weather[0].icon,
    };

    res.json({ currentWeather });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data cuaca terkini.');
  }
}

async function getWeeklyWeatherController(req, res) {
  const { latitude, longitude } = req.params;

  try {
    const apiKey = '46c6c92b227b811959df28fc16e0e637';
    const weeklyWeatherEndpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const response = await weather(weeklyWeatherEndpoint);
    const weeklyWeatherData = await response.json();

    const weeklyWeather = weeklyWeatherData.list.map((item) => ({
      date: new Date(item.dt * 1000),
      temperature: {
        min: item.main.temp_min,
        max: item.main.temp_max,
      },
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    res.json({ weeklyWeather });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data cuaca mingguan.');
  }
}

module.exports = { getCurrentWeatherController, getWeeklyWeatherController };
