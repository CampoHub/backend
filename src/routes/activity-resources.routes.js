const express = require('express');
const router = express.Router();
const activityResourceController = require('../controllers/activity-resources.controller');
const { authenticateToken } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/roles');

router.get(
  '/:activityId/resources',
  authenticateToken,
  checkRole(['admin', 'gestor', 'trabajador']),
  activityResourceController.getActivityResources
);

router.post(
  '/:activityId/resources',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityResourceController.assignResource
);

router.put(
  '/resources/:id/status',
  authenticateToken,
  checkRole(['admin', 'gestor']),
  activityResourceController.updateResourceStatus
);

router.delete(
  '/resources/:id',
  authenticateToken,
  checkRole(['admin']),
  activityResourceController.removeResource
);

module.exports = router;