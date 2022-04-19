class RateLimiter {
    /**
     * @input
     * - limit: max number of actions can reach
     * - duration: time to check `limit` actions (in milliseconds)
    */
    constructor(limit, duration) {
        this.fullLimit = limit;
        this.range = duration;
        this.currentLimit = 0;
        this.lastUpdate = Date.now();
    }

    computeCurrentLimit() {
        const timePassed = Date.now() - this.lastUpdate;
        const regenerateRate = this.fullLimit / this.range;
        const limitRegenerated = timePassed * regenerateRate;

        console.log("time passed: ", timePassed);
        console.log("regenerated: ", regenerateRate);
        console.log("limit regenerated: ", limitRegenerated);

        return Math.min(this.fullLimit, this.currentLimit + limitRegenerated);
    }

    action() {
        const currentLimit = this.computeCurrentLimit();
        console.log("current limit: ", currentLimit);
        console.log("====================================");

        if (currentLimit < 1) {
            throw new Error('Limit exceed');
        }

        this.currentLimit = currentLimit - 1;
        this.lastUpdate = Date.now();
    }
}

module.exports = RateLimiter;
