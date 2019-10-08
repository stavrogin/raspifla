const WeatherData = require('../models/weatherData');

exports.getWeatherData = (req, res, next) => {
  const daysBack = req.query.daysBack;
  WeatherData.fetchAll(daysBack)
  .then(results => {
    const weatherDataList = [];
    results.forEach(weatherData => {
      weatherData.ts = formatDate(weatherData.ts);
      delete weatherData._id;
      delete weatherData.datasource;
      weatherDataList.push(weatherData);
    });
    res.json(JSON.stringify(weatherDataList));
  })
  .catch(err => {
    console.log(err);
    res.status(500).json('{"error": "Error in fetching data: " ' + err + '}');
  });
};

const formatDate = (timestampFromEpoch) => {
  const date = new Date(timestampFromEpoch);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return day + '/' + month + '/' + year + ' ' + hour + ':' + minute + ':' + second;
}


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

