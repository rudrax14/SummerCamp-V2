const Redis = require("ioredis");

let redis;

if (process.env.NODE_ENV !== 'production') {
    redis = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    });
} else {
    redis = new Redis();
}



module.exports = redis;