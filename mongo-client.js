const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27018';
const client = new MongoClient(url);

const dbName = 'rate-limit';

module.exports = {
    connectDB: () => {
        return client.connect();
    },
    getClient: () => {
        return client.db(dbName);
    }
};
