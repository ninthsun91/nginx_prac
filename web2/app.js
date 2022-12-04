const express = require('express');
const app = express();
const PORT = 5000;

const redis = require('redis');
const redisClient = redis.createClient({
    'url': 'redis://nginx-redis:6379'
});
redisClient.connect().then(() => {
    console.log('WEB2 REDIS CONNECTED');
});

app.get('/', async(req, res) => {
    try {
        let visitCnt = await redisClient.get('visitCnt')
        if (isNaN(visitCnt)) visitCnt = 0;
        console.log('web2 get: ', visitCnt);
    
        await redisClient.set('visitCnt', ++visitCnt);
        console.log('web2 set: ', visitCnt);

        res.status(200).send(`web2: ${visitCnt}`);        
    } catch (error) {
        console.error(error);
    }
});

app.listen(PORT, () => {
    console.log('front on', PORT);
});