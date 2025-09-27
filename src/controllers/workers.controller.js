const { Worker, User } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const workers = await Worker.findAll({ include: User });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: "Error listando trabajadores" });
  }
};

exports.create = async (req, res) => {
  try {
    const worker = await Worker.create(req.body);
    res.status(201).json(worker);
  } catch (err) {
    res.status(500).json({ error: "Error creando trabajador" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Worker.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Trabajador no encontrado" });
    res.json({ message: "Trabajador actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando trabajador" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Worker.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Trabajador no encontrado" });
    res.json({ message: "Trabajador eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando trabajador" });
  }
};
