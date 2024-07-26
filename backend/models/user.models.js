const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    campgrounds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Campground',
        },
    ],
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
