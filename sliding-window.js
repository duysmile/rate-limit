const mongo = require('mongodb');
class RateLimiter {
    /**
     * @input
     * - limit: max number of actions can reach
     * - duration: time to check `limit` actions (in seconds)
    */
    constructor(limit, duration, mongoClient) {
        this.fullLimit = limit;
        this.range = duration * 1000;
        // this.currentLimit = this.fullLimit;
        // this.lastUpdate = Date.now();

        this.lastUpdateKey = 'rate-limit:last-update';
        this.currentLimitKey = 'rate-limit:limit-key';
        this.mongo = mongoClient;
    }

    async computeCurrentLimit() {
        const filter = { _id: mongo.ObjectId("625fe73fbf2efeb804954133"), };

        let data = await this.mongo.collection('request_limit')
            .findOne(filter);

        let lastUpdate = Date.now();
        let currentLimit = this.fullLimit;
        if (data) {
            lastUpdate = data.lastUpdate;
            currentLimit = data.currentLimit;
        }

        const timePassed = Date.now() - lastUpdate;
        const regenerateRate = this.fullLimit / this.range;
        const limitRegenerated = timePassed * regenerateRate;

        console.log("time passed: ", timePassed);
        console.log("regenerated: ", regenerateRate);
        console.log("limit regenerated: ", limitRegenerated);

        return Math.min(this.fullLimit, currentLimit + limitRegenerated);
    }

    async action() {
        const currentLimit = await this.computeCurrentLimit();
        console.log("current limit: ", currentLimit);
        console.log("====================================");

        if (currentLimit < 1) {
            throw new Error('Limit exceed');
        }

        const filter = {
            _id: mongo.ObjectId("625fe73fbf2efeb804954133"),
            currentLimit: {
                $gte: 1,
            },
        };
        const updatedData = {
            $set: {
                lastUpdate: Date.now(),
            },
            $inc: {
                currentLimit: -1,
            },
        };

        const options = {
            upsert: true,
        };
        const res = await this.mongo.collection('request_limit').updateOne(
            filter,
            updatedData,
            options,
        );

        if (res.modifiedCount == 0) {
            throw new Error('Limit exceed');
        }
    }
}

module.exports = RateLimiter;
