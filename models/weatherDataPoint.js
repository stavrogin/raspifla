const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const weatherDataPointSchema = new Schema({
    datasource: String,
    temperature: Number,
    pressure: Number,
    altitude: Number,
    ts: {
        type: Date, 
        required:true
    },
    formattedTS: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('WeatherDataPoint', weatherDataPointSchema);