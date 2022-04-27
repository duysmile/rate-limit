const express = require('express');

// const RateLimiter = require('./sliding-window');
const RateLimiter = require('./fixed-window');
const MongoClient = require('./mongo-client');
const RedisClient = require('./redis-client');

const app = express();

async function main() {
    await MongoClient.connectDB();
    await RedisClient.init();
    const rateLimiter = new RateLimiter(3, 10, RedisClient.getClient());

    const rateLimitMiddleware = async (req, res, next) => {
        try {
            await rateLimiter.action();
        } catch (error) {
            console.error(error);
            return next(error);
        }

        return next();
    };

    app.get('/api/v1/users', rateLimitMiddleware, (req, res) => {
        res.json([
            {
                id: 1,
                name: 'A',
            },
            {
                id: 2,
                name: 'B',
            },
            {
                id: 3,
                name: 'C',
            },
            {
                id: 4,
                name: 'D',
            },
        ]);
    });

    app.use((err, req, res, next) => {
        res.status(400).send(err.message);
    })

    app.listen(3000, () => {
        console.log(`server started at port 3000`);
    });
}

main();
