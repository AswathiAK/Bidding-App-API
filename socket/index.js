export const handleSocketConnection = (socket, io) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("place-bid", (bid) => {
    io.emit("update", bid);
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
