const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/workers.controller");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/roles");

router.get("/", auth, checkRole("admin", "gestor"), ctrl.getAll);

router.post("/", auth, checkRole("admin"), ctrl.create);

router.put("/:id", auth, checkRole("admin"), ctrl.update);

router.delete("/:id", auth, checkRole("admin"), ctrl.remove);

module.exports = router;
