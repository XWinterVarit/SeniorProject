const Redis = require('ioredis')

const redis = new Redis({
        port: 6379,
        host: 'redis',
        family: 4,
        retryStrategy: (times) => {
                let delay = Math.min(times * 50, 2000)
                return delay
        }
})

console.log("Connection to redis completed!")
module.exports.tools = {
        redis: redis
}

