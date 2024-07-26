const Review = require('../models/review.model');
const Campground = require('../models/campground.model');

exports.addReview = async (req, res) => {
    const { content, rating, campgroundId } = req.body;
    try {
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
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong while adding the review"
        });
    }
};

// exports.getReviewById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const review = await Review.findById(id)
//             .populate('userId', 'username')
//             .populate('campgroundId', 'name');

//         if (!review) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Review not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             data: review
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({
//             success: false,
//             message: "Something went wrong while fetching the review"
//         });
//     }
// };

exports.editReview = async (req, res) => {
    const { id } = req.body;
    try {
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        Object.assign(review, req.body);

        const updatedReview = await review.save();

        res.status(200).json({
            success: true,
            data: updatedReview
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong while editing the review"
        });
    }
};

exports.deleteReview = async (req, res) => {
    const { id } = req.body; 
    try {
        // Find and delete the review by ID
        const review = await Review.findByIdAndDelete(id);

        // If review is not found, return a 404 status with an error message
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
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
    } catch (err) {
        console.error(err); // Log the error for debugging
        // Return a 500 status with a generic error message
        res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the review"
        });
    }
};

