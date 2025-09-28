const express = require('express');
const {
    login,
    register,
    forgotPassword,
    resetPassword,
    profile
} = require('../controllers/auth.controller.js');
const auth = require("../middlewares/auth");

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);
router.get("/profile", auth, profile);

module.exports = router;
