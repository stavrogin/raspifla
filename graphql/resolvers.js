const WeatherDataPoint = require('../models/weatherDataPoint');
const meteoService = require('../services/meteoService');

module.exports = {
    //query
    retrieveWeatherDataPoints: async function( { weatherDataPointFilter } , req) {
        const weatherDataPointsOut = await meteoService.getWeatherData(
            weatherDataPointFilter.datasource, 
            weatherDataPointFilter.daysBack
            );
        return weatherDataPointsOut;
    },
    //mutation
    storeWeatherDataPoint: async function( { weatherDataPointInputData } , req) {
        const storedWeatherDataPoint = await meteoService.postWeatherData(
            weatherDataPointInputData.datasource, 
            weatherDataPointInputData.temperature, 
            weatherDataPointInputData.pressure, 
            weatherDataPointInputData.altitude, 
            weatherDataPointInputData.ts
            );
        return storedWeatherDataPoint;
    }
};