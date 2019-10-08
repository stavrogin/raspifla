const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://flavio:3fCDs5SLU0vXAxsk@cluster0-o9gnp.mongodb.net/admin?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected to Atlas MongoDB');
        callback(client);
    })
    .catch(err => {
        console.log(err);
    });
}

module.exports = mongoConnect;

