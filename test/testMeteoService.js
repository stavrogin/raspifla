const expect = require('chai').expect;
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const meteoService = require('../services/meteoService');
const WeatherDataPoint = require('../models/weatherDataPoint');

var Mockgoose = require('mock-mongoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

describe('Test meteo service', () => {

    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            const config = {
                useUnifiedTopology: true,
                useNewUrlParser: true,
            };

            mongoose.connect('mongodb://localhost/mockDB', config, (err) => {

            // load data from JSON (points dated 12 oct)
                const mockFile = path.join(__dirname, 'mock', 'mockedWeatherDataPoints.json');
                const mockedWeatherDataPoints = fs.readFileSync(mockFile);
                const points = JSON.parse(mockedWeatherDataPoints);

                for (let index in points) {
                    const weatherDataPoint = new WeatherDataPoint(points[index]);
                    weatherDataPoint.save();
                }
            
            // add 1 point dated today
                const now = new Date();
                const weatherDataPoint = new WeatherDataPoint({
                    datasource: 'app',
                    temperature: 22,
                    pressure: 990,
                    altitude: 50,
                    ts: now
                });

                weatherDataPoint
                    .save();

                done(err);
            });
        }).catch((err) => {
            done(err);
        });
    });

    after(function (done) {
        mongoose.disconnect().then(() => {
            mockgoose.killMongo();
            done();
        }).catch((err) => {
            mockgoose.killMongo();
            done(err);
        });
    });

    it("Should extract all app weather data points", (done) => {
        meteoService.getWeatherData('app').then(weatherDataPoints => {
            expect(weatherDataPoints.length).to.equal(5);
            weatherDataPoints.forEach(weatherDataPoint => {
                expect(weatherDataPoint).not.to.have.property('ts');
                expect(weatherDataPoint).to.have.property('formattedTS');
            });
            done();
        }).catch(err => {
            console.log(err);
            done();
            throw err;
        });
    });

    it("Should extract all postman weather data points", (done) => {
        meteoService.getWeatherData('postman').then(weatherDataPoints => {
            expect(weatherDataPoints.length).to.equal(1);
            done();
        }).catch(err => {
            console.log(err);
            done();
            throw err;
        });
    });

    it("Should extract all app weather data points 1 day dack", (done) => {
        meteoService.getWeatherData('app', 1).then(weatherDataPoints => {
            expect(weatherDataPoints.length).to.equal(1);
            done();
        }).catch(err => {
            console.log(err);
            done();
            throw err;
        });
    });

});
