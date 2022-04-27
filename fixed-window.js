class RateLimiter {
     /**
     * @input
     * - limit: max number of actions can reach
     * - duration: time to check `limit` actions (in seconds)
    */
    constructor(limit, duration, redisClient) {
        this.fullLimit = limit;
        this.time = duration;
        this.redis = redisClient;

        this.key = 'rate-limit:bucket';
    }

    async action() {
        let currentLimit = await this.redis.get(this.key);
        console.log('current:', currentLimit);
        if (currentLimit) {
            currentLimit = parseInt(currentLimit);
            if (currentLimit > this.fullLimit) {
                throw new Error('Limit exceed');
            }
        }

        currentLimit = await this.redis.incr(this.key);
        console.log('increase:', currentLimit);
        currentLimit = parseInt(currentLimit);
        if (currentLimit > this.fullLimit) {
            throw new Error('Limit exceed');
        }

        if (currentLimit == 1) {
            console.log('set expire');
            await this.redis.expire(this.key, this.time);
        }
        console.log('done', currentLimit);
    }
}

module.exports = RateLimiter;
