import * as mongoose from "mongoose";
import { Server } from "socket.io";
import body from "body-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";

dotenv.config();
const app = express();

const server = http.createServer(app);

// Socket para comunicacion back/front
export const socket = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Dejar en origin: "*" si el front no esta en localhost
    methods: ["GET", "POST"],
  },
});

// Url de conexion con mongodb
const mongourl = process.env.MONGO_URL;

async function start() {
  try {
    // Conectar a la base de datos
    await mongoose
      .connect(mongourl)
      .then(() => console.log("DB Conected"))
      .catch(console.error);

    app.use(
      body.json({
        limit: "500kb",
      })
    );
    // Permitir Cross-origin resource sharing
    app.use(cors());

    // Rutas de la api
    app.use("/register", require("./routes/register"));
    app.use("/students", require("./routes/students"));

    // Iniciar server y socket
    app.listen(3001, () => {
      console.log("Server is running on port 3001 ");
    });
    server.listen(3002, () => {
      console.log("Socket Server is running on port 3002");
    });
  } catch (error) {
    console.log(error);
  }
}
start();
