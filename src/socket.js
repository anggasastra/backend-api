const { Server } = require("socket.io");

let io = null;

function setupWebSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Ubah ke origin yang aman kalau sudah production
      methods: ['GET', 'POST']
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected via WebSocket", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
    });
  });
}

function broadcastUID(uid) {
  if (io) {
    io.emit("uid-detected", { uid });
  }
}

function broadcastAbsensiData(absensiData) {
  if (io) {
    io.emit("absensiBerhasil", absensiData);
  }
}

module.exports = {
  setupWebSocket,
  broadcastUID,
  broadcastAbsensiData
};
