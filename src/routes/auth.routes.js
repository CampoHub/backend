const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/auth.controller");
const auth = require("../middlewares/auth");

router.post("/register", ctrl.register);

router.post("/login", ctrl.login);

router.get("/profile", auth, ctrl.profile);

module.exports = router;
