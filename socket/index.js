export const handleSocketConnection = (socket, io) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("place-bid", (bid) => {
    io.emit("update", bid);
  });

  socket.on("notify", (notification) => {
    io.emit("notify", notification);
  });
  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
