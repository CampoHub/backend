const express = require('express');
const router = express.Router();
const activityResourceController = require('../controllers/activity-resources.controller');
const { authenticateToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');

// GET /activities/:activityId/resources
router.get(
  '/:activityId/resources',
  authenticateToken,
  checkRole(['admin', 'gestor', 'trabajador']),
  activityResourceController.getActivityResources
);

// POST /activities/:activityId/resources
router.post(
  '/:activityId/resources',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityResourceController.assignResource
);

// PUT /activity-resources/:id/status
router.put(
  '/resources/:id/status',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityResourceController.updateResourceStatus
);

// DELETE /activity-resources/:id
router.delete(
  '/resources/:id',
  authenticateToken,
  checkRole(['admin']),
  activityResourceController.removeResource
);

module.exports = router;