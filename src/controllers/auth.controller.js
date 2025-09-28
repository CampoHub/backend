const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const crypto = require('crypto');
// const { sendEmail } = require('../utils/nodemailer');

const register = async (req, res) => {
  try {
    const request = req.body;
    const nombre = request.name;
    const correo = request.email;
    const contraseña = request.password;
    const rol = request.rol || 'trabajador';

    if (!nombre || !correo || !contraseña) {
      return res.status(400).json({
        message: 'Datos incompletos',
        detalles: 'Nombre, correo y contraseña son obligatorios'
      });
    }

    const existingUser = await User.findOne({ where: { correo } });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const passwordToHash = String(contraseña);
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);

    const newUser = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol,
      is_active: true
    });

    const userResponse = {
      id: newUser.id,
      nombre: newUser.nombre,
      correo: newUser.correo,
      rol: newUser.rol,
      is_active: newUser.is_active
    };

    res.status(201).json({ message: 'Usuario registrado exitosamente', user: userResponse });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
}

const login = async (req, res) => {
    const request = req.body;
    const correo = request.email;
    const contraseña = request.password;

    try {
        const userExist = await User.findOne({ where: { correo } })

        if (!userExist) return res.status(400).json({ message: 'Usuario no encontrado' })

        const validPassword = await bcrypt.compare(contraseña, userExist.contraseña)
        if (!validPassword) return res.status(403).json({ message: 'Contraseña incorrecta' })

        const user = {
            id: userExist.id,
            nombre: userExist.nombre,
            correo: userExist.correo,
            rol: userExist.rol,
            is_active: userExist.is_active,
            createdAt: userExist.createdAt,
            updatedAt: userExist.updatedAt
        }

        const token = jwt.sign({ user: user }, process.env.JWT_SECRET || 'secreto123', { expiresIn: process.env.JWT_EXPIRES_IN || '1h' })

        res.json({ message: 'Inicio de sesión exitoso', token })
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al loguear el usuario', error: error.message });
    }
}

const resetTokens = new Map()

const resetEmailTemplate = ({ nombre, resetUrl }) => {
    return `
    <div style="max-width: 520px; margin:0; padding: 20px;">
        <h2>Recupera tu contraseña</h2>
        <p>Hola ${nombre || ''}, recibimos tu solicitud para restablecer la contraseña.</p>
        <p>Hace click en el boton para continuar.</p>
        <p>
            <a href=${resetUrl}>
                Cambiar contraseña
            </a>
        </p>
        <p>Si no fuiste vos, podes ignorar el mensaje</p>
    </div>
    `
}

const forgotPassword = async (req, res) => {
    const { correo } = req.body

    try {
        const user = await User.findOne({ where: { correo } })
        if (!user) return res.status(400).json({ message: 'El usuario no existe' })

        const rawToken = crypto.randomBytes(32).toString('hex')
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
        const expiresAt = Date.now() + 15 * 60 * 1000

        resetTokens.set(user.id, { tokenHash, expiresAt })

        const resetUrl = `${process.env.FRONT_URL || 'http://localhost:5173'}/recuperar-contraseña?token=${rawToken}&id=${user.id}`

        await sendEmail({
            to: user.correo,
            subject: 'Recupera tu contraseña',
            html: resetEmailTemplate({ nombre: user.nombre, resetUrl })
        })

        return res.status(200).json({ message: 'Mail enviado correctamente' })
    } catch (error) {
        return res.status(500).json({ message: 'Error al enviar el mail', error: error.message })
    }
}

const resetPassword = async (req, res) => {
    const { id, token, contraseña } = req.body
    if (!id || !token || !contraseña) return res.status(400).json({ message: 'Faltan datos' })
    try {
        const entry = resetTokens.get(Number(id))
        if (!entry) return res.status(400).json({ message: 'Token inválido' })

        if (entry.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'Token expirado' })
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

        if (tokenHash !== entry.tokenHash) return res.status(400).json({ message: 'Token inválido' })

        const user = await User.findByPk(id)
        if (!user) return res.status(400).json({ message: 'El usuario no existe' })

        user.contraseña = await bcrypt.hash(contraseña, 10)
        await user.save()

        resetTokens.delete(Number(id))

        return res.status(201).json({ message: 'Contraseña actualizada exitosamente' })

    } catch (error) {
        return res.status(500).json({ message: 'Error al resetear contraseña' })
    }
}

const profile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
          attributes: ["id", "nombre", "correo", "rol", "is_active", "createdAt", "updatedAt"]
        });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Error obteniendo perfil", details: err.message });
    }
};


module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  profile
}
