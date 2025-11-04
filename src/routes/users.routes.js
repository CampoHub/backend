const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/users.controller");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/roles");


router.get("/profile", auth, userCtrl.getProfile);
router.get("/", auth, checkRole("admin", "trabajador"), userCtrl.getAll);
router.post("/", auth, checkRole("admin"), userCtrl.create);
router.put("/:id", auth, checkRole("admin"), userCtrl.update);
router.delete("/:id", auth, checkRole("admin"), userCtrl.remove);

module.exports = router;
