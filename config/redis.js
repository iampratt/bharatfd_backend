const redis = require('redis');
const redisClient = redis.createClient();

redisClient
  .connect()
  .then(() => {
    console.log('Redis Connected');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = redisClient;
