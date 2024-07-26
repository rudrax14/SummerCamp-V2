const { fetchUsers } = require('../controllers/user.controller')
const { auth } = require('../middlewares/auth.middleware')

const router = require('express').Router();

router.route('/profile').get(auth, fetchUsers)

module.exports = router;