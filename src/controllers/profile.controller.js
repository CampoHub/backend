const bcrypt = require('bcrypt');
const { User } = require("../models");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'nombre', 'correo', 'rol']
    });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({
      id: user.id,
      nombre: user.nombre,
      email: user.correo,
      rol: user.rol
    });
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ message: "Error al obtener el perfil" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const { nombre, correo } = req.body;

    // Verificar si el email ya está en uso por otro usuario
    if (correo && correo !== user.correo) {
      const existingUser = await User.findOne({ where: { correo } });
      if (existingUser) {
        return res.status(400).json({ message: "El correo ya está en uso" });
      }
    }

    await user.update({
      nombre: nombre || user.nombre,
      correo: correo || user.correo
    });

    res.json({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono
    });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña actual
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Contraseña actual incorrecta" });
    }

    // Encriptar y guardar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ message: "Error al cambiar la contraseña" });
  }
};