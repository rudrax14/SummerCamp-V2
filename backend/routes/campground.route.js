const express = require('express');
const router = express.Router();
const { auth, isAuthor } = require('../middlewares/auth.middleware');
const { createCampground, getCampgrounds, getCampgroundById, updateCampground, deleteCampground } = require('../controllers/campground.controller');

// Campground Routes
router.route('/campgrounds')
    .get(getCampgrounds)
    .post(auth, createCampground);

router.route('/campgrounds/:id')
    .get(getCampgroundById)
    .put(auth, isAuthor, updateCampground)
    .delete(auth, isAuthor, deleteCampground);

module.exports = router;
