const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const auth = require('../middlewares/auth');

router.get('/profile', auth, profileController.getProfile);
router.put('/profile', auth, profileController.updateProfile);
router.put('/profile/change-password', auth, profileController.changePassword);

module.exports = router;