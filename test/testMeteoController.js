const expect = require('chai').expect;
const sinon = require('sinon');

const meteoController = require('../controllers/meteoController');
const WeatherDataPoint = require('../models/weatherDataPoint');


describe('Test meteo controller', () => {

    it("Should throw error if there was an exception in retrieving data", (done) => {
        sinon.stub(WeatherDataPoint, 'find');
        WeatherDataPoint.find.throws();
        
        const req = {
            query: {
                daysBack: 10
            }
        };
        const res = {
            status: function (status) {
                this.status = status;
                return this;
            },
            json: function (json) {
                this.json = json;
            }
        };
        
        meteoController.getWeatherData(req, res, () => {}).then(result => {
            expect(result).to.be.an('error');
            done();
        });

        WeatherDataPoint.find.restore();
    });

    it("Should be ok when retrieve data", (done) => {
        sinon.stub(WeatherDataPoint, 'find').callsFake(function fakeFn() {
            const mock = [
                {
                    "temperature": 22.1,
                    "pressure": 989.95,
                    "altitude": 59.146441668679564,
                    "datasource": "app",
                    "ts": 1570885039000,
                    toObject: function() {
                        return this;
                    }
                },
                {
                    "temperature": 22.2,
                    "pressure": 990.04,
                    "altitude": 59.82184905735194,
                    "datasource": "app",
                    "ts": 1570885040000,
                    toObject: function() {
                        return this;
                    }
                }
            ];
            return {
                sort: sinon.stub().returns(mock)
            };
        });
        
        const req = {
            query: {
                daysBack: 10
            }
        };
        const res = {
            status: function (status) {
                this.status = status;
                return this;
            },
            json: function (json) {
                this.json = json;
            }
        };
        
        meteoController.getWeatherData(req, res, () => {}).then(result => {
            expect(res.json.length).to.equal(2);
            done();
        });

        WeatherDataPoint.find.restore();
    });
   
});
