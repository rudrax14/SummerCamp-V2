const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const errorController = require('./controllers/errorController');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

// Default route
app.get("/", (req, res) => {
    console.log("Hello, this is the summer-camp backend");
    res.send("Hello, this is the summer-camp backend");
});

// Importing routes
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const campgroundRoutes = require("./routes/campground.route");
const reviewRoutes = require("./routes/review.route");
const CustomError = require('./utils/CustomError');

// Declaring routes
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', campgroundRoutes);
app.use('/api/v1', reviewRoutes);
app.all('*', (req, res, next) => {
    next(new CustomError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handling middleware
app.use(errorController);

module.exports = app;
