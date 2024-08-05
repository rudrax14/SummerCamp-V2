const jwt = require('jsonwebtoken');
const Campground = require('../models/campground.model');
const redis = require('../config/redisConnection');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const Review = require('../models/review.model');

exports.auth = catchAsync(async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.body.token || req.cookies.token;

    if (!token) {
        return next(new CustomError("No token provided", 401));
    }

    try {
        // Check if the token is blacklisted
        redis.get(`blacklist:${token}`, (err, data) => {
            if (err) {
                console.error('Redis error:', err);
                return next(new CustomError("Error checking token blacklist", 500));
            }

            if (data) {
                return next(new CustomError("Token is blacklisted", 401));
            } else {
                try {
                    // Verify token
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    req.user = decoded; // Attach user information to the request object
                    next();
                } catch (err) {
                    console.error('Token verification error:', err);
                    return next(new CustomError("Invalid token", 401));
                }
            }
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return next(new CustomError("An unexpected error occurred", 500));
    }
});

exports.isAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);

    if (campground.author.toString() === req.user.id) {
        next();
    } else {
        return next(new CustomError("You do not have permission to perform this action", 403));
    }

});

exports.isReviewAuthor = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Corrected to req.params
    const review = await Review.findById(id);

    if (!review) {
        return next(new CustomError("Review not found", 404));
    }

    // Assuming req.user.id is a string, convert review.userId to string before comparison
    if (review.userId.toString() === req.user.id) {
        next();
    } else {
        return next(new CustomError("You do not have permission to perform this action", 403));
    }
});

