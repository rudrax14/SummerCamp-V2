const express = require('express');
const router = express.Router();
const { auth, isAuthor, isReviewAuthor } = require('../middlewares/auth.middleware');
const { addReview, editReview, deleteReview } = require('../controllers/review.controller');

// Review Routes
router.route('/review')
    .post(auth, addReview);

router.route('/review/:id')
    .put(auth, isReviewAuthor, editReview)
    .delete(auth, isReviewAuthor, deleteReview);

module.exports = router;
