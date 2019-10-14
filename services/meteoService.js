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
            let detachedWeatherDataPoint = weatherDataPoint.toObject();
            const formattedTS = formatDate(detachedWeatherDataPoint.ts);
            detachedWeatherDataPoint.formattedTS = formattedTS;
            //remove unnecessary fields from json response
            delete detachedWeatherDataPoint.ts;
            delete detachedWeatherDataPoint.__v;
            delete detachedWeatherDataPoint._id;
            delete detachedWeatherDataPoint.datasource;
            weatherDataList.push(detachedWeatherDataPoint);
        });

        return weatherDataList;

    } catch (err) {
        console.log(err);
        throw err;
    }

};

/**
 * Saves a weather data point coming from request body
 */
exports.postWeatherData = (datasource, temperature, pressure, altitude, ts) => {
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
            return result;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
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
