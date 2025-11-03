const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const authRouter = require('./routes/auth.routes.js');

app.get("/", (req, res) => {
  res.json({ message: "API del campo funcionando 🚜" });
});

app.use('/auth', authRouter);
app.use("/users", require("./routes/users.routes"));
app.use("/api", require("./routes/profile.routes"));
app.use("/plots", require("./routes/plots.routes"));
app.use("/activities", require("./routes/activities.routes"));
app.use("/trabajadores", require("./routes/workers.routes"));
app.use("/resources", require("./routes/resources.routes"));
app.use("/workers", require("./routes/workers.routes"));
app.use("/assignments", require("./routes/assignments.routes"));

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    app.listen(port, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });
