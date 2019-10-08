const WeatherData = require('../models/weatherData');

exports.getWeatherData = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json( {
      datasourceId: 1,
      temperature: 22,
      pressure: 960,
      height: 200
    });
};

exports.postWeatherData = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  console.log(req.body);
  const temperature = req.body.temperature;
  const pressure = req.body.pressure;
  const altitude = req.body.altitude;
  const weatherData = new WeatherData(temperature, pressure, altitude);
  res.status(200).json( weatherData);
};

