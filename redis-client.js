const { createClient } = require('redis');

class RedisClient {
    init() {
        this.client = createClient();
        return this.client.connect();
    }

    getClient() {
        return this.client;
    }
}

module.exports = new RedisClient();
