const express = require('express');
const router = express.Router();
const { auth, isAuthor } = require('../middlewares/auth.middleware');
const { addReview, editReview, deleteReview } = require('../controllers/review.controller');

// Review Routes
router.route('/review')
    .post(auth, addReview);

router.route('/review/:id')
    .put(auth, isAuthor, editReview)
    .delete(auth, isAuthor, deleteReview);

module.exports = router;
