const { ActivityResource, Resource, Activity } = require('../models');
const { Op } = require('sequelize');

const activityResourceController = {

  async getActivityResources(req, res) {
    try {
      const { activityId } = req.params;
      const { page = 1, limit = 10, estado } = req.query;
      const offset = (page - 1) * limit;

      const where = { activity_id: activityId };
      if (estado) {
        where.estado = estado;
      }

      const { count, rows } = await ActivityResource.findAndCountAll({
        where,
        include: [
          {
            model: Resource,
            as: 'resource',
            attributes: ['id', 'nombre', 'tipo', 'unidad_medida']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.json({
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        resources: rows
      });
    } catch (error) {
      console.error('Error al obtener recursos de la actividad:', error);
      res.status(500).json({ message: 'Error al obtener los recursos' });
    }
  },

  async assignResource(req, res) {
    try {
      const { activityId } = req.params;
      const { resource_id, cantidad } = req.body;

      const activity = await Activity.findByPk(activityId);
      if (!activity) {
        return res.status(404).json({ message: 'Actividad no encontrada' });
      }

      const resource = await Resource.findByPk(resource_id);
      if (!resource) {
        return res.status(404).json({ message: 'Recurso no encontrado' });
      }

      if (cantidad > resource.cantidad_disponible) {
        return res.status(400).json({ 
          message: `Cantidad insuficiente. Disponible: ${resource.cantidad_disponible}` 
        });
      }

      const activityResource = await ActivityResource.create({
        activity_id: activityId,
        resource_id,
        cantidad,
        fecha_asignacion: new Date()
      });

      res.status(201).json(activityResource);
    } catch (error) {
      console.error('Error al asignar recurso:', error);
      res.status(500).json({ message: 'Error al asignar el recurso' });
    }
  },

  async updateResourceStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado, fecha_devolucion } = req.body;

      const activityResource = await ActivityResource.findByPk(id);
      if (!activityResource) {
        return res.status(404).json({ message: 'Asignación de recurso no encontrada' });
      }

      if (estado === 'devuelto' && !fecha_devolucion) {
        await activityResource.update({
          estado,
          fecha_devolucion: new Date()
        });
      } else {
        await activityResource.update({ estado, fecha_devolucion });
      }

      res.json(activityResource);
    } catch (error) {
      console.error('Error al actualizar estado del recurso:', error);
      res.status(500).json({ message: 'Error al actualizar el estado del recurso' });
    }
  },

  async removeResource(req, res) {
    try {
      const { id } = req.params;

      const activityResource = await ActivityResource.findByPk(id);
      if (!activityResource) {
        return res.status(404).json({ message: 'Asignación de recurso no encontrada' });
      }

      if (activityResource.estado !== 'pendiente') {
        return res.status(400).json({ 
          message: 'No se puede eliminar un recurso que está en uso o ya fue devuelto' 
        });
      }

      const resource = await Resource.findByPk(activityResource.resource_id);
      if (resource) {
        await resource.increment('cantidad_disponible', { 
          by: activityResource.cantidad 
        });
      }

      await activityResource.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar asignación de recurso:', error);
      res.status(500).json({ message: 'Error al eliminar la asignación del recurso' });
    }
  }
};

module.exports = activityResourceController;