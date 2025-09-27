const { Plot } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const plots = await Plot.findAll();
    res.json(plots);
  } catch (err) {
    res.status(500).json({ error: "Error listando parcelas", details: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const plot = await Plot.create(req.body);
    res.status(201).json(plot);
  } catch (err) {
    res.status(500).json({ error: "Error creando parcela", details: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Plot.update(req.body, { where: { id } });

    if (updated) {
      const updatedPlot = await Plot.findByPk(id);
      return res.json(updatedPlot);
    }
    res.status(404).json({ error: "Parcela no encontrada" });
  } catch (err) {
    res.status(500).json({ error: "Error actualizando parcela", details: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Plot.destroy({ where: { id } });

    if (deleted) {
      return res.json({ message: "Parcela eliminada" });
    }
    res.status(404).json({ error: "Parcela no encontrada" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando parcela", details: err.message });
  }
};
