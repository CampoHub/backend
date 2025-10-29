const express = require('express');
const router = express.Router();
const activityAssignmentController = require('../controllers/activity-assignments.controller');
const { authenticateToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');

// GET /activities/:activityId/assignments
router.get(
  '/:activityId/assignments',
  authenticateToken,
  checkRole(['admin', 'gestor', 'trabajador']),
  activityAssignmentController.getAssignments
);

// POST /activities/:activityId/assignments
router.post(
  '/:activityId/assignments',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityAssignmentController.createAssignment
);

// PUT /activity-assignments/:id/unassign
router.put(
  '/assignments/:id/unassign',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityAssignmentController.unassignWorker
);

// DELETE /activity-assignments/:id
router.delete(
  '/assignments/:id',
  authenticateToken,
  checkRole(['admin']),
  activityAssignmentController.deleteAssignment
);

module.exports = router;