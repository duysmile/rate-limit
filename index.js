const express = require('express');
const RateLimiter = require('./rate-limiter');

const app = express();

const rateLimiter = new RateLimiter(3, 1000 * 100);

const rateLimitMiddleware = (req, res, next) => {
    try {
        rateLimiter.action();
    } catch (error) {
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
