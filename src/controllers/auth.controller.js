const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const { name, email, password, rol = "trabajador" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nombre, correo y contraseña son obligatorios" });
    }

    const existingUser = await User.findOne({ where: { correo: email } });
    if (existingUser) return res.status(400).json({ message: "El usuario ya existe" });

    const hashed = await bcrypt.hash(String(password), 10);

    const newUser = await User.create({
      nombre: name,
      correo: email,
      contraseña: hashed,
      rol,
      is_active: true
    });

    const token = jwt.sign(
      { sub: newUser.id, role: newUser.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ where: { correo: email } });
    if (!userExist) return res.status(400).json({ message: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, userExist.contraseña);
    if (!validPassword) return res.status(403).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { sub: userExist.id, role: userExist.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al loguear el usuario" });
  }
};

const resetTokens = new Map();

const forgotPassword = async (req, res) => {
  res.status(500).json({ message: "no implementado" });
};

const resetPassword = async (req, res) => {
  res.status(500).json({ message: "no implementado" });
};

const profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.sub, {
      attributes: ["id", "nombre", "correo", "rol", "is_active", "createdAt", "updatedAt"]
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo perfil" });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  profile
};
