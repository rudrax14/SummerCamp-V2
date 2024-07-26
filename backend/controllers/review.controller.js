const Review = require('../models/review.model');
const Campground = require('../models/campground.model');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');

exports.addReview = catchAsync(async (req, res, next) => {
    const { content, rating, campgroundId } = req.body;

    const newReview = new Review({
        content,
        rating,
        userId: req.user.id,
        campgroundId
    });

    const review = await newReview.save();

    // Push into campground's reviews
    const campground = await Campground.findById(campgroundId);
    campground.reviews.push(review._id);
    await campground.save();

    res.status(201).json({
        success: true,
        data: review
    });

});

exports.editReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
        return next(new CustomError(`Review not found with id of ${id}`, 404));
    }

    Object.assign(review, req.body);

    const updatedReview = await review.save();

    res.status(200).json({
        success: true,
        data: updatedReview
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Corrected to req.params

    // Find and delete the review by ID
    const review = await Review.findByIdAndDelete(id);

    // If the review is not found, return a 404 status with an error message
    if (!review) {
        return next(new CustomError(`Review not found with id of ${id}`, 404));
    }

    // Find the campground associated with the review
    const campground = await Campground.findById(review.campgroundId);
    if (campground) {
        // Remove the review ID from the campground's reviews array
        campground.reviews.pull(review._id);
        await campground.save(); // Save the updated campground
    }

    // Return a success message
    res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
});


