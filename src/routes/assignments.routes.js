const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/assignments.controller");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/roles");

router.get("/", auth, ctrl.getAll);

router.get("/activity/:activityId", auth, ctrl.getByActivity);

router.post("/", auth, checkRole("admin", "gestor"), ctrl.create);

router.put("/:id", auth, checkRole("admin", "gestor"), ctrl.update);

router.delete("/:id", auth, checkRole("admin", "gestor"), ctrl.delete);

module.exports = router;