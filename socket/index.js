export const handleSocketConnection = (socket, io) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("place-bid", (message) => {
    console.log("Bid is placed", message);
    io.emit("bid", message);
  });

  // Handle Disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
};
