const socketIO = require("socket.io");

const ORIGIN_URL =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.PRODUCTION_URL;

let io;

function initSocket(server) {
  io = socketIO(server, {
    cors: {
      origin: ORIGIN_URL,
    },
  });

  io.on("connection", (socket) => {
    console.log("new client connected ");
    //io.emit('welcome', 'Welcome to my socketIO server ' + socket.id)
  });
}

function getSocketIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
}

module.exports = {
  initSocket,
  getSocketIO,
};
