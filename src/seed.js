require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Plot, Activity, Resource, Worker } = require("./models");

async function seed() {
  try {
    await sequelize.sync({ force: true });

    console.log("📦 Tablas sincronizadas, cargando datos iniciales...");

    const adminPass = await bcrypt.hash("admin123", 10);
    const gestorPass = await bcrypt.hash("gestor123", 10);
    const trabajadorPass = await bcrypt.hash("trabajador123", 10);

    const admin = await User.create({
      nombre: "Admin Principal",
      correo: "admin@campo.com",
      contraseña: adminPass,
      rol: "admin"
    });

    const gestor = await User.create({
      nombre: "Gestor de Campo",
      correo: "gestor@campo.com",
      contraseña: gestorPass,
      rol: "gestor"
    });

    const trabajadorUser = await User.create({
      nombre: "Juan Trabajador",
      correo: "trabajador@campo.com",
      contraseña: trabajadorPass,
      rol: "trabajador"
    });

    // 👷 Trabajador vinculado al usuario trabajador
    const trabajador = await Worker.create({
      especialidad: "agricultor",
      id_usuario: trabajadorUser.id,
    });

    const parcela1 = await Plot.create({
      nombre: "Lote Norte",
      superficie: 50.5,
      tipo_cultivo: "maiz",
      estado: "sembrado"
    });

    const parcela2 = await Plot.create({
      nombre: "Lote Sur",
      superficie: 30.2,
      tipo_cultivo: "trigo",
      estado: "en preparación"
    });

    await Resource.create({
      tipo: "tractor",
      cantidad: 2,
      id_parcela: parcela1.id,
      disponible: true
    });

    await Resource.create({
      tipo: "fertilizante",
      cantidad: 100,
      id_parcela: parcela2.id,
      disponible: true
    });

    await Activity.create({
      nombre: "Siembra Maíz",
      tipo: "siembra",
      id_parcela: parcela1.id,
      fecha_inicio: new Date(),
      fecha_fin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estado: "pendiente"
    });

    await Activity.create({
      nombre: "Preparación Trigo",
      tipo: "fertilizacion",
      id_parcela: parcela2.id,
      fecha_inicio: new Date(),
      fecha_fin: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      estado: "pendiente"
    });

    console.log("Seed completado");
    process.exit(0);
  } catch (error) {
    console.error("Error en seed:", error);
    process.exit(1);
  }
}

seed();
