exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    // No permitir cambiar la contraseña aquí (por seguridad)
    const { nombre, correo, rol, is_active } = req.body;
    user.nombre = nombre !== undefined ? nombre : user.nombre;
    user.correo = correo !== undefined ? correo : user.correo;
    user.rol = rol !== undefined ? rol : user.rol;
    user.is_active = is_active !== undefined ? is_active : user.is_active;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error actualizando usuario" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    await user.destroy();
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error eliminando usuario" });
  }
};
const { User } = require("../models");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Error listando usuarios" });
  }
};

exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error creando usuario" });
  }
};
