const express = require('express');
const router = express.Router();
const activityAssignmentController = require('../controllers/activity-assignments.controller');
const { authenticateToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');

router.get(
  '/:activityId/assignments',
  authenticateToken,
  checkRole(['admin', 'gestor', 'trabajador']),
  activityAssignmentController.getAssignments
);

router.post(
  '/:activityId/assignments',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityAssignmentController.createAssignment
);

router.put(
  '/assignments/:id/unassign',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityAssignmentController.unassignWorker
);

router.delete(
  '/assignments/:id',
  authenticateToken,
  checkRole(['admin']),
  activityAssignmentController.deleteAssignment
);

module.exports = router;