import express from "express";

import { PORT } from "./config.js";
import { sequelize } from "./db.js";

import "./models/Users.js";
import "./models/appointments.js";

import peluqueriaRoutes from "./routes/users.routes.js";
import appointmentRoutes from "./routes/appointments.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

try {
  app.use(express.json());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    if (req.method === "OPTIONS") {
      return res.sendStatus(200); 
    }
    next();
  });

  app.listen(PORT);
  app.use(peluqueriaRoutes);
  app.use(appointmentRoutes);
  app.use(authRoutes);

  await sequelize.sync();

  console.log(`Server listening on port ${PORT}`);
} catch (error) {
  console.log(`Ocurrio un error en la inicialización.`);
}
