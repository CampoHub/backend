const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { sequelize } = require("./models");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/users.routes"));
app.use("/plots", require("./routes/plots.routes"));
app.use("/activities", require("./routes/activities.routes"));
app.use("/resources", require("./routes/resources.routes"));
app.use("/workers", require("./routes/workers.routes"));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`🚀 API corriendo en puerto ${PORT}`));
});
