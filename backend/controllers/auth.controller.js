const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../config/redisConnection");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/CustomError");

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if the user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //     return next(new CustomError('User already exists', 400));
    // }
    // is been handled in the errorController.js

    // Secure password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user in the database
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
    });
});

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;

    // Check for registered user
    let user = await User.findOne({ email });
    if (!user) {
        return next(new CustomError('No user found', 401));
    }

    // Verify password & generate a JWT token
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
    };

    // Compare password
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        // If passwords don't match, send response without password
        return next(new CustomError('Invalid credentials', 401));
    }

    // Password match
    let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
    });
    user.password = undefined; // Remove password from response

    // Set token in Redis with expiry
    redis.set(`user:${user._id.toString()}`, token, "EX", 120, (err, reply) => {
        if (err) {
            console.log("Error in setting token in redis", err);
        }
        console.log("Token set in redis", reply);
    });

    res.status(200).json({
        success: true,
        user,
        token,
        message: "User logged in successfully",
    });

});

exports.logout = async (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.body.token || req.cookies.token;
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is missing' });
    }
    redis.set(`blacklist:${token}`, "blacklisted", "EX", 120, (err, reply) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error in redis connection" });
        }
        return res.status(200).json({ success: true, message: "Token is blacklisted" });
    });
};

exports.checkToken = async (req, res) => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.body.token || req.cookies.token;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is missing' });
    }

    redis.get(`blacklist:${token}`, (err, reply) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Error in redis connection" });
        }
        if (reply) {
            return res.status(401).json({ success: false, message: "Token is blacklisted" });
        }
        return res.status(200).json({ success: true, message: "Token is valid" });
    });
};