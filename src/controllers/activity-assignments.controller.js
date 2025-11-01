const { ActivityAssignment, Worker, Activity } = require('../models');
const { Op } = require('sequelize');


const buildFilterConditions = (query) => {
  const conditions = {};

  if (query.active === 'true') {
    conditions.unassigned_at = null;
  } else if (query.active === 'false') {
    conditions.unassigned_at = { [Op.ne]: null };
  }

  if (query.worker_id) {
    conditions.worker_id = query.worker_id;
  }

  if (query.rol) {
    conditions.rol_en_actividad = query.rol;
  }

  return conditions;
};

const activityAssignmentController = {

  async getAssignments(req, res) {
    try {
      const { activityId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;

      const where = {
        activity_id: activityId,
        ...buildFilterConditions(req.query)
      };

      if (req.user.role === 'trabajador') {
        const worker = await Worker.findOne({ where: { user_id: req.user.id } });
        if (!worker) {
          return res.status(403).json({ message: 'Acceso denegado' });
        }
        where.worker_id = worker.id;
      }

      const { count, rows } = await ActivityAssignment.findAndCountAll({
        where,
        include: [
          {
            model: Worker,
            as: 'worker',
            attributes: ['id', 'nombre', 'apellido']
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
        assignments: rows
      });
    } catch (error) {
      console.error('Error al obtener asignaciones:', error);
      res.status(500).json({ message: 'Error al obtener las asignaciones' });
    }
  },

  async createAssignment(req, res) {
    try {
      const { activityId } = req.params;
      const { worker_id, rol_en_actividad, assigned_at } = req.body;

      const activity = await Activity.findByPk(activityId);
      if (!activity) {
        return res.status(404).json({ message: 'Actividad no encontrada' });
      }

      const worker = await Worker.findByPk(worker_id);
      if (!worker) {
        return res.status(404).json({ message: 'Trabajador no encontrado' });
      }

      const assignment = await ActivityAssignment.create({
        activity_id: activityId,
        worker_id,
        rol_en_actividad,
        assigned_at: assigned_at || new Date()
     });

      res.status(201).json(assignment);
    } catch (error) {
      if (error.message === 'Ya existe una asignación activa para este trabajador en esta actividad') {
        return res.status(400).json({ message: error.message });
      }
      console.error('Error al crear asignación:', error);
      res.status(500).json({ message: 'Error al crear la asignación' });
    }
  },

  async unassignWorker(req, res) {
    try {
      const { id } = req.params;
      const { unassigned_at } = req.body;
      
      const assignment = await ActivityAssignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ message: 'Asignación no encontrada' });
      }
      
      await assignment.update({
        unassigned_at: unassigned_at || new Date()
      });
      
      res.json(assignment);
    } catch (error) {
      if (error.message.includes('unassigned_at debe ser posterior')) {
        return res.status(400).json({ message: error.message });
      }
      console.error('Error al desasignar trabajador:', error);
      res.status(500).json({ message: 'Error al desasignar al trabajador' });
    }
  },

  async deleteAssignment(req, res) {
    try {
      const { id } = req.params;
      
      const assignment = await ActivityAssignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ message: 'Asignación no encontrada' });
      }
      
      await assignment.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar asignación:', error);
      res.status(500).json({ message: 'Error al eliminar la asignación' });
    }
  }
};

module.exports = activityAssignmentController;