const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type WeatherDataPoint {
        _id: ID!
        datasource: String
        temperature: Float
        pressure: Float
        altitude: Float
        ts: String
        formattedTS: String
    }

    input WeatherDataPointInputData {
        datasource: String!
        temperature: Float
        pressure: Float
        altitude: Float
        ts: Float!
    }

    input WeatherDataPointFilter {
        datasource: String
        daysBack: Int
    }

    type RootQuery {
        retrieveWeatherDataPoints(weatherDataPointFilter: WeatherDataPointFilter): [WeatherDataPoint!]
    }

    type RootMutation {
        storeWeatherDataPoint(weatherDataPointInputData: WeatherDataPointInputData): WeatherDataPoint!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);