const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/assignments.controller");
const auth = require("../middlewares/auth.js");
const checkRole = require("../middlewares/roles.js");

router.get("/", auth, checkRole("admin", "gestor", "trabajador"), ctrl.getAll);
router.get("/activity/:activityId", auth, checkRole("admin", "gestor", "trabajador"), ctrl.getByActivity);
router.post("/", auth, checkRole("admin", "gestor"), ctrl.create);
router.put("/:id", auth, checkRole("admin", "gestor"), ctrl.update);
router.put("/:id/unassign", auth, checkRole("admin", "gestor"), ctrl.unassign);
router.delete("/:id", auth, checkRole("admin", "gestor"), ctrl.delete);

module.exports = router;
