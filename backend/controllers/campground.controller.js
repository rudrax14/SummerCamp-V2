const Campground = require('../models/campground.model');
const User = require("../models/user.models");
const catchAsync = require('../utils/catchAsync');
const uploadFileToCloudinary = require('../utils/imageUpload');

exports.createCampground = async (req, res) => {
    const { name, geometry, price, location, description } = req.body;

    if (!req.files || !req.files.thumbnail) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded"
        });
    }

    const file = req.files.thumbnail;

    try {
        const result = await uploadFileToCloudinary(file, "campgrounds");
        // Create a new campground with the uploaded thumbnail URL
        const newCampground = new Campground({
            name,
            thumbnail: result.secure_url,
            geometry,
            price,
            location,
            description,
            author: req.user.id,
        });

        const campground = await newCampground.save();

        // Update the user's campgrounds array
        await User.findByIdAndUpdate(req.user.id, {
            $push: { campgrounds: campground._id }
        });

        res.status(201).json({
            success: true,
            data: campground
        });
    } catch (err) {
        console.error('Error during upload:', err); // Log any errors during upload
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the campground"
        });
    }
};


exports.getCampgrounds = async (req, res) => {
    try {
        const campgrounds = await Campground.find().populate('author', 'username');
        res.status(200).json({ success: true, data: campgrounds });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong while fetching campgrounds" });
    }
};

exports.getCampgroundById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id)
        .populate({
            path: 'author',
            select: 'name email'
        })
        .populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'content rating name'
            }
        });

    if (!campground) {
        return next(new ErrorResponse(`Campground not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: campground });
});

exports.updateCampground = async (req, res) => {
    const { id } = req.params;

    try {
        const campground = await Campground.findById(id);
        if (!campground) {
            return res.status(404).json({ success: false, message: "Campground not found" });
        }

        if (!campground.author.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: "You do not have permission to update this campground" });
        }

        // Update fields
        const updateFields = ['name', 'geometry', 'price', 'location', 'description'];
        updateFields.forEach(field => {
            if (req.body[field] !== undefined) {
                campground[field] = req.body[field];
            }
        });

        // Handle file upload if there's a new thumbnail
        if (req.files && req.files.thumbnail) {
            const file = req.files.thumbnail;
            const result = await uploadFileToCloudinary(file, "campgrounds");
            campground.thumbnail = result.secure_url;
        }

        const updatedCampground = await campground.save();
        res.status(200).json({ success: true, data: updatedCampground });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong while updating the campground" });
    }
};

exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    try {
        const campground = await Campground.findById(id);
        if (!campground) {
            return res.status(404).json({ success: false, message: "Campground not found" });
        }

        if (!campground.author.equals(req.user.id)) {
            return res.status(403).json({ success: false, message: "You do not have permission to delete this campground" });
        }

        // Remove the campground from the user's campgrounds array
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { campgrounds: campground._id }
        });

        // Delete the campground
        await Campground.findByIdAndDelete(id);

        res.status(200).json({ success: true, message: "Campground deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Something went wrong while deleting the campground" });
    }
};

