const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    const exists = await User.findOne({ where: { correo } });
    if (exists) return res.status(400).json({ error: "El correo ya está registrado" });

    const hashedPass = await bcrypt.hash(contraseña, 10);

    const user = await User.create({
      nombre,
      correo,
      contraseña: hashedPass,
      rol,
    });

    res.status(201).json({ message: "Usuario creado", user });
  } catch (err) {
    res.status(500).json({ error: "Error en registro", details: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const user = await User.findOne({ where: { correo } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const validPass = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPass) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, correo: user.correo },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login exitoso", token });
  } catch (err) {
    res.status(500).json({ error: "Error en login", details: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "nombre", "correo", "rol", "is_active", "createdAt", "updatedAt"]
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo perfil", details: err.message });
  }
};
