import prisma from "../db/db.config.js";

export const handleSocketConnection = (socket, io) => {
  console.log(`User connected: ${socket.id}`);

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
