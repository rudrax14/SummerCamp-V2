const { fetchUsers, sendPasswordResetEmail, verifyOTPAndResetPassword } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth.middleware');

const router = require('express').Router();

router.route('/profile').get(auth, fetchUsers)
router.post("/request-password-reset", sendPasswordResetEmail);
router.post("/reset-password", verifyOTPAndResetPassword);

module.exports = router;