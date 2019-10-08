const mongodb = require('mongodb');
const mongoClient = mongodb.MongoClient;

//convention (use internally in this file)
let _db;

const mongoConnect = (callback) => {
    mongoClient.connect('mongodb+srv://flavio:3fCDs5SLU0vXAxsk@cluster0-o9gnp.mongodb.net/raspifla?retryWrites=true&w=majority')
    .then(client => {
        console.log('Connected to Atlas MongoDB');
        _db = client.db();
        callback(client);
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

const getDB = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;

