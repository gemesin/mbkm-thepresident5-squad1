const express = require('express');
const {weatherModel} = require("../models");

async function getCurrentWeatherController(req, res) {
  const { latitude, longitude } = req.query;

  try {
    const apiKey = '46c6c92b227b811959df28fc16e0e637';
    const currentWeatherEndpoint = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&lang=id&units=metric`;

    const response = await fetch(currentWeatherEndpoint);
    const currentWeatherData = await response.json();

    const currentWeather = {
      date: new Date(currentWeatherData.dt * 1000),
      temperature: currentWeatherData.main.temp,
      main: currentWeatherData.weather[0].main,
      humidity: currentWeatherData.main.humidity,
      "wind speed": currentWeatherData.wind.speed,
      description: currentWeatherData.weather[0].description,
      location: currentWeatherData.name,
      icon: currentWeatherData.weather[0].icon,
    };

    const weatherIcon = await weatherModel.findOne({
      where: {icon: currentWeather.icon}
    })

    currentWeather.path = weatherIcon.path
    res.json({ currentWeather });
  } catch (error) {
    console.error(error);
    res.status(500).json({msg: 'Terjadi kesalahan dalam mengambil data cuaca terkini.'});
  }
}

async function getWeeklyWeatherController(req, res) {
  const { latitude, longitude } = req.query;

  try {
    const apiKey = '46c6c92b227b811959df28fc16e0e637';
    const weeklyWeatherEndpoint = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=id&appid=${apiKey}&units=metric`;

    const response = await fetch(weeklyWeatherEndpoint);
    const weeklyWeatherData = await response.json();

    const dailyWeather = {};
    weeklyWeatherData.list.forEach((item) => {
      const date = new Date(item.dt_txt);
      const eachDay = date.toISOString().split('T')[0]; 
      console.log(eachDay)
      if (!dailyWeather[eachDay]) {
        dailyWeather[eachDay] = {
          date,
          temperature: item.main.temp,
          main: item.weather[0].main,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
    });

    const dailyWeatherArray = Object.values(dailyWeather);

    for (const weatherItem of dailyWeatherArray) {
      const weatherIcon = await weatherModel.findOne({
        where: { icon: weatherItem.icon },
      });
      weatherItem.path = weatherIcon.path;
    }

    res.json(dailyWeatherArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Terjadi kesalahan dalam mengambil data cuaca terkini.',
    });
  }
}

module.exports = { getCurrentWeatherController, getWeeklyWeatherController };
