const { Resource, Plot } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const resources = await Resource.findAll({ include: Plot });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: "Error listando recursos" });
  }
};

exports.create = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(500).json({ error: "Error creando recurso" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Resource.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json({ message: "Recurso actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando recurso" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resource.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Recurso no encontrado" });
    res.json({ message: "Recurso eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando recurso" });
  }
};
