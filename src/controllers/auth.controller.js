const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");

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
  try {
    console.log('Iniciando proceso de recuperación de contraseña');
    const { correo } = req.body;
    console.log('Correo recibido:', correo);
    
    // Verificar que el usuario existe
    console.log('Buscando usuario en la base de datos...');
    const user = await User.findOne({ where: { correo } });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log('Usuario encontrado:', user.id);

    // Generar token único
    console.log('Generando token de recuperación...');
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expirationTime = Date.now() + 3600000; // 1 hora de validez
    console.log('Token generado:', resetToken);

    // Almacenar token con tiempo de expiración
    resetTokens.set(resetToken, {
      userId: user.id,
      expiresAt: expirationTime
    });

    // Crear enlace de recuperación
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Enviar correo
    await sendEmail({
      to: correo,
      subject: "Recuperación de Contraseña",
      html: `
        <h1>Recuperación de Contraseña</h1>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetLink}">Restablecer Contraseña</a>
        <p>Este enlace es válido por 1 hora.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `
    });

    res.json({ message: "Se ha enviado un correo con las instrucciones para restablecer tu contraseña" });
  } catch (error) {
    console.error('Error en forgotPassword:', error);
    res.status(500).json({ message: "Error al procesar la solicitud de recuperación de contraseña" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, nuevaContraseña } = req.body;

    // Verificar que el token existe y no ha expirado
    const resetData = resetTokens.get(token);
    if (!resetData || Date.now() > resetData.expiresAt) {
      return res.status(400).json({ message: "Token inválido o expirado" });
    }

    // Obtener usuario
    const user = await User.findByPk(resetData.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar contraseña
    const hashedPassword = await bcrypt.hash(String(nuevaContraseña), 10);
    await user.update({ contraseña: hashedPassword });

    // Eliminar token usado
    resetTokens.delete(token);

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: "Error al restablecer la contraseña" });
  }
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
