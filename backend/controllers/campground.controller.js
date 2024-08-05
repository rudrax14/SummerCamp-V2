const Campground = require('../models/campground.model');
const User = require("../models/user.models");
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/CustomError');
const uploadFileToCloudinary = require('../utils/imageUpload');

exports.createCampground = catchAsync(async (req, res, next) => {
    const { name, geometry, price, location, description, thumbnail } = req.body;


    // Create a new campground with the uploaded thumbnail URL
    const newCampground = new Campground({
        name,
        thumbnail,
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

});

exports.upload = catchAsync(async (req, res, next) => {
    if (!req.files || !req.files.thumbnail) {
        return next(new CustomError('Please upload a image', 400));
    }

    const file = req.files.thumbnail;


    const result = await uploadFileToCloudinary(file, "campgrounds");

    res.status(200).json({ success: true, imageUrl: result.secure_url });
});

exports.getCampgrounds = catchAsync(async (req, res) => {
    const campgrounds = await Campground.find().populate('author', 'username');
    res.status(200).json({ success: true, data: campgrounds });
});

exports.getCampgroundById = catchAsync(async (req, res, next) => {
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

exports.updateCampground = catchAsync(async (req, res, next) => {
    const { id } = req.params;


    const campground = await Campground.findById(id);
    if (!campground) {
        return next(new CustomError(`Campground not found with id of ${req.params.id}`, 404));
    }

    // Update fields
    const updateFields = ['name', 'geometry', 'price', 'location', 'description', 'thumbnail'];
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

});

exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    if (!campground) {
        return next(new CustomError(`Campground not found with id of ${req.params.id}`, 404));
    }

    // Remove the campground from the user's campgrounds array
    await User.findByIdAndUpdate(req.user.id, {
        $pull: { campgrounds: campground._id }
    });

    // Delete the campground
    await Campground.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Campground deleted successfully" });

});

