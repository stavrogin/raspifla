const WeatherData = require('../models/weatherData');

exports.getWeatherData = (req, res, next) => {
  const daysBack = req.query.daysBack;
  WeatherData.fetchAll(daysBack)
  .then(results => {
    res.json(results);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json('{"error": "Error in fetching data: " ' + err + '}');
  });
};

exports.postWeatherData = (req, res, next) => {
  console.log(req.body);
  const datasource = req.body.datasource;
  const temperature = req.body.temperature;
  const pressure = req.body.pressure;
  const altitude = req.body.altitude;
  let ts = req.body.ts;
  if (!ts) {
    ts = Date.now();
  }
  const weatherData = new WeatherData(datasource, temperature, pressure, altitude, ts);
  weatherData.save();
  res.status(201).json(weatherData);
};

