const { Activity, Plot } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const activities = await Activity.findAll({ include: Plot });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: "Error listando actividades" });
  }
};

exports.create = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (err) {
    res.status(500).json({ error: "Error creando actividad" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Activity.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Actividad no encontrada" });
    res.json({ message: "Actividad actualizada" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando actividad" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Activity.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Actividad no encontrada" });
    res.json({ message: "Actividad eliminada" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando actividad" });
  }
};
