const connectDB = require('./config/dbConnection')
const app = require("./app")
const cloudinary = require('./config/cloudinary');
const redis = require('./config/redisConnection');

// Cloudinary connection
cloudinary.cloudinaryConnect();

// redis connection
redis.on('connect', () => {
    console.log('Redis connected');
});
redis.on('error', (err) => {
    console.log('Redis connection failed !!! ', err);
});


// Database connection
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });