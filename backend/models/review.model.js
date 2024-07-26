const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    campgroundId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campground',
        required: true,
    }
}, {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
