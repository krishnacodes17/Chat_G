require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./src/app");
const connectToDB = require("./src/config/db");
const initSocketServer = require("./src/sockets/socket.server");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Socket.IO server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

initSocketServer(io);

connectToDB();

server.listen(PORT, () => {
    console.log("Server is listening on Port:", PORT);
});