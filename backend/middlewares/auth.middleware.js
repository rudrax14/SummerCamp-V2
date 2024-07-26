const jwt = require('jsonwebtoken');
const Campground = require('../models/campground.model');
const redis = require('../config/redisConnection');

exports.auth = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "") || req.body.token || req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Token Missing' });
        }

        // Check if the token is blacklisted
        redis.get(`blacklist:${token}`, (err, reply) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Error in redis connection" });
            }
            if (reply) {
                return res.status(401).json({ success: false, message: "Token is blacklisted" });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
                if (err) {
                    return res.status(401).json({ success: false, message: "Token is invalid" });
                }
                req.user = decode;
                next();
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(401).json({ success: false, message: "Something went wrong while verifying token" });
    }
};

exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    try {
        const campground = await Campground.findById(id);
        if (campground && campground.author.equals(req.user.id)) {
            next();
        } else {
            res.status(403).json({ success: false, message: "You do not have permission to perform this action" });
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: "Campground not found" });
    }
};
