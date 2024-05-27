import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import userRouter from "./routes/userRoute.js";
import itemRouter from "./routes/itemRoute.js";
import bidRouter from "./routes/bidRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

import { createError } from "./middlewares/errorHandler.js";
import { handleSocketConnection } from "./socket/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

const server = createServer(app);

app.get("/", (req, res) => {
  res.status(200).send("API is Running");
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/users", userRouter);
app.use("/items", itemRouter);
app.use("/items", bidRouter);
app.use("/notifications", notificationRouter);

app.all("*", (req, res, next) =>
  next(
    createError(404, `http://localhost:${PORT}${req.originalUrl} is Not Found`)
  )
);

// Global Error Handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  res.status(errorStatus).json({
    status: errorStatus,
    message: errorMessage,
  });
});

// Socket connection
const io = new Server(server);
io.on("connection", (socket) => {
  handleSocketConnection(socket, io);
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
