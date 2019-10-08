const getDB = require('../util/database').getDB;

class WeatherData {
    constructor(datasource, temperature, pressure, altitude, ts) {
        this.datasource = datasource;
        this.temperature = temperature;
        this.pressure = pressure;
        this.altitude = altitude;
        this.ts = ts;
    }

    save() {
        const db = getDB();
        //returns promise
        db.collection('weatherData')
        .insertOne(this)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.log(err);
        });
    }

    static fetchAll(daysBack) {
        let filter;
        if (daysBack) {
            const now = Date.now();
            const daysBackMillis = 1000 * 60 * 60 * 24;
            const dateFrom = now - daysBackMillis;
            filter = {
                datasource: 'postman',
                ts: {$gte: dateFrom}
            };
        } else {
            filter = {
                datasource: 'postman'
            }
        }

        const db = getDB();
        return db
            .collection('weatherData')
            .find(filter)
            .toArray()
            .then(weatherData => {
                return weatherData;
            })
            .catch(error => {
                console.log(error);
            });
    }

}

module.exports = WeatherData;