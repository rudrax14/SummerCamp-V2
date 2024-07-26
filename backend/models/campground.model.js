const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    thumbnail: {
        type: String,
        required: [true, 'Image is required'],
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            // required: true,
        },
        coordinates: {
            type: [Number],
            // required: true,
        }
    },
    price: {
        type: Number,
        require: [true, 'Price is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, 'Author is required'],
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        }
    ],
}, {
    timestamps: true,
});

campgroundSchema.index({ geometry: '2dsphere' });

const Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
