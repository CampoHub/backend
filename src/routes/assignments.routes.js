const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/assignments.controller");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/roles");

// Obtener todas las asignaciones
router.get("/", auth, ctrl.getAll);

// Obtener asignaciones de una actividad específica
router.get("/activity/:activityId", auth, ctrl.getByActivity);

// Crear una nueva asignación
router.post("/", auth, checkRole("admin", "gestor"), ctrl.create);

// Actualizar una asignación
router.put("/:id", auth, checkRole("admin", "gestor"), ctrl.update);

// Eliminar una asignación
router.delete("/:id", auth, checkRole("admin", "gestor"), ctrl.delete);

module.exports = router;