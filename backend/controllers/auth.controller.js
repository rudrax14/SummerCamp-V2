const User = require("../models/user.models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redis = require("../config/redisConnection");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/CustomError");

// exports.signup = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;


//         // check if user already exist 
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User Already Exists",
//             })
//         }

//         // Secured password using bcrypt
//         let hashedPassword;
//         try {
//             hashedPassword = await bcrypt.hash(password, 10);
//         }
//         catch (err) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Error in hashing password",
//             })
//         }

//         // Create data to db
//         let user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//         });

//         return res.status(200).json({
//             success: true,
//             message: "User Created Successfully",
//             data: user
//         });
//     } catch (err) {
//         console.error(err)
//         return res.status(500).json({
//             success: false,
//             message: "User cannot be register,Please try again later",
//         })
//     }
// }

exports.signup = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;

    // if (!name || !email || !password) {
    //     return next(new CustomError('Please provide name, email and password', 400));
    // }

    // Check if the user already exists
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //     return next(new CustomError('User already exists', 400));
    // }
    // is been handled in the errorController.js

    // Secure password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for registered user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist",
            });
        }

        // Verify password & generate a JWT token
        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        // Compare password
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // If passwords don't match, send response without password
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials, Password does not match",
            });
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "User cannot be logged in, please try again later",
        });
    }
};

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