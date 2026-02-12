import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

// Connect DB
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL, // production frontend URL
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`✅ User ${userId} joined notification room`);
  });

  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Attach io to app
app.set("io", io);

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
