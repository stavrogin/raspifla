const meteoService = require('../services/meteoService');

/**
 * Retrieves all the weather data eventaully gathered from some days back
 */
exports.getWeatherData = async (req, res, next) => {
  const daysBack = req.query.daysBack;
  try {
    const weatherDataList = await meteoService.getWeatherData('app', daysBack);
    res.json(weatherDataList);
  } catch (err) {
    res.status(500).json('{"error": "Error in fetching data: " ' + err + '}');
  }
};

/**
 * Saves a weather data point coming from request body
 */
exports.postWeatherData = async (req, res, next) => {
  const datasource = req.body.datasource;
  const temperature = req.body.temperature;
  const pressure = req.body.pressure;
  const altitude = req.body.altitude;
  let ts = req.body.ts;
  if (!ts) {
    ts = Date.now();
  }
  
  const savedDataPoint = await meteoService.postWeatherData(datasource, temperature, pressure, altitude, ts);
  res.status(201).json(savedDataPoint);
};