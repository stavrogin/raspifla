const WeatherDataPoint = require('../models/weatherDataPoint');

/**
 * Retrieves weather data from the specified datasource (app or postman), with the specified days back
 */
exports.getWeatherData = async (dataSource, daysBack) => {

    const filter = buildFetchWeatherDataFilter(dataSource, daysBack);

    try {
        const results = await WeatherDataPoint
            .find(filter)
            .sort({ 'ts': 'asc' });

        const weatherDataList = [];
        results.forEach(weatherDataPoint => {
            const formattedTS = formatDate(weatherDataPoint.ts);
            weatherDataPoint.formattedTS = formattedTS;
            weatherDataList.push(weatherDataPoint);
        });

        return weatherDataList;

    } catch (err) {
        throw err;
    }

};

/**
 * Saves a weather data point coming from request body
 */
exports.postWeatherData = async (datasource, temperature, pressure, altitude, ts) => {
    const weatherDataPoint = new WeatherDataPoint({
        datasource: datasource,
        temperature: temperature,
        pressure: pressure,
        altitude: altitude,
        ts: ts
    });

    try {
        const result = await weatherDataPoint.save();
        const formattedTS = formatDate(result.ts);
        result.formattedTS = formattedTS;
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

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
    const daysBackMillis = 1000 * 60 * 60 * 24 * daysBack;
    const dateFrom = now - daysBackMillis;
    filter = {
        datasource: datasource,
        ts: { $gte: dateFrom }
    };
    return filter;
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
};

/**
 * Adds a leading zero to a date field (e.g.: month 3 becomes 03)
 * @param {*} elem the element to eventually add a leading zero
 */
const formatDateElemWithLeadingZero = (elem) => {
    return (elem > 9 ? '' : '0') + elem;
};
