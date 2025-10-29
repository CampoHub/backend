const db = require("../models");
const { Op } = require("sequelize");

// Obtener todas las asignaciones
exports.getAll = async (req, res) => {
  try {
    console.log('Intentando obtener asignaciones...');
    const assignments = await db.ActivityAssignment.findAll({
      include: [
        {
          model: db.Activity,
          as: "activity",
          attributes: ['id', 'nombre', 'tipo', 'estado']
        },
        {
          model: db.Worker,
          as: "worker",
          attributes: ['id', 'especialidad']
        }
      ],
      attributes: [
        'id', 
        'activity_id',
        'worker_id',
        'start_date',
        'end_date',
        'status',
        'rol'
      ]
    });

    console.log('Asignaciones obtenidas:', assignments);

    // Transformar los datos para el formato que espera el frontend
    const formattedAssignments = assignments.map(assignment => ({
      id: assignment.id,
      activityId: assignment.activity_id,
      workerId: assignment.worker_id,
      startDate: assignment.start_date,
      endDate: assignment.end_date,
      status: assignment.status,
      rol: assignment.rol,
      activity: assignment.activity,
      worker: assignment.worker
    }));

    console.log('Asignaciones formateadas:', formattedAssignments);
    res.json(formattedAssignments);
  } catch (error) {
    console.error('Error al obtener las asignaciones:', error);
    res.status(500).json({ message: "Error al obtener las asignaciones", error: error.message });
  }
};

// Obtener asignaciones por actividad
exports.getByActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const assignments = await db.ActivityAssignment.findAll({
      where: { activityId },
      include: [
        {
          model: db.Worker,
          as: "worker"
        }
      ]
    });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las asignaciones" });
  }
};

// Crear una nueva asignación
exports.create = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    const assignment = await db.ActivityAssignment.create({
      activity_id: req.body.activity_id,
      worker_id: req.body.worker_id,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      status: req.body.status,
      rol: req.body.rol
    });
    console.log('Asignación creada:', assignment);
    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error al crear la asignación:', error);
    res.status(500).json({ 
      message: "Error al crear la asignación",
      error: error.message,
      details: error.errors ? error.errors.map(e => e.message) : undefined
    });
  }
};

// Actualizar una asignación
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await db.ActivityAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }
    await assignment.update(req.body);
    res.json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la asignación" });
  }
};

// Eliminar una asignación
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const assignment = await db.ActivityAssignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ message: "Asignación no encontrada" });
    }
    await assignment.destroy();
    res.json({ message: "Asignación eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la asignación" });
  }
};