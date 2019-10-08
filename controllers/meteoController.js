const WeatherDataPoint = require('../models/weatherDataPoint');

/**
 * Retrieves all the weather data eventaully gathered from some days back
 */
exports.getWeatherData = (req, res, next) => {
  const daysBack = req.query.daysBack;
  const filter = buildFetchWeatherDataFilter('app', daysBack);

  WeatherDataPoint
    .find(filter)
    .then(results => {
      const weatherDataList = [];
      results.forEach(weatherData => {
        weatherData.ts = formatDate(weatherData.ts);
        delete weatherData._id;
        delete weatherData.datasource;
        weatherDataList.push(weatherData);
      });
      res.json(weatherDataList);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json('{"error": "Error in fetching data: " ' + err + '}');
    });
};

/**
 * Saves a weather data point coming from request body
 */
exports.postWeatherData = (req, res, next) => {
  const datasource = req.body.datasource;
  const temperature = req.body.temperature;
  const pressure = req.body.pressure;
  const altitude = req.body.altitude;
  let ts = req.body.ts;
  if (!ts) {
    ts = Date.now();
  }
  const weatherDataPoint = new WeatherDataPoint({
    datasource: datasource, 
    temperature: temperature, 
    pressure: pressure, 
    altitude: altitude, 
    ts: ts
  });

  weatherDataPoint
    .save()
    .then(result => {
      console.log('Created weather data with ts: ' + ts);
    })
    .catch(err => {
      console.log(err);
    });

  res.status(201).json(weatherDataPoint);
};

/**
 * Formats a Date object to String dd/mm/yyyy hh:mm:ss
 * @param {*} timestampFromEpoch the date timestamp to format
 */
const formatDate = (timestampFromEpoch) => {
  const date = new Date(timestampFromEpoch);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  return formatDateElemWithLeadingZero(day)
        + '/' 
        + formatDateElemWithLeadingZero(month)
        + '/' 
        + year 
        + ' ' 
        + formatDateElemWithLeadingZero(hour) 
        + ':' 
        + formatDateElemWithLeadingZero(minute) 
        + ':' 
        + formatDateElemWithLeadingZero(second);
}

/**
 * Adds a leading zero to a date field (e.g.: month 3 becomes 03)
 * @param {*} elem the element to eventually add a leading zero
 */
const formatDateElemWithLeadingZero = (elem) => {
  return (elem > 9 ? '' : '0') + elem;
}

/**
 * Builds mongoose data filter to retrieve weather data
 * @param {*} datasource the datasource (tipically 'app' or 'postman' )
 * @param {*} daysBack the days back to retrieve data from now
 */
const buildFetchWeatherDataFilter = (datasource, daysBack) => {
  if (!daysBack) {
    filter = {
      datasource: datasource
    };
    return filter;
  }
  
  const now = Date.now();
  const daysBackMillis = 1000 * 60 * 60 * 24;
  const dateFrom = now - daysBackMillis;
  filter = {
      datasource: datasource,
      ts: {$gte: dateFrom}
  };
  return filter;
}



