import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

// 🔥 HTTP server
const server = http.createServer(app);

// 🔥 SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // for local dev
      "client-service-production-f8cf.up.railway.app", // production frontend URL on Railway
    ],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  // Join user-specific room for notifications
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

// 🔥 ATTACH io to app for use in controllers
app.set("io", io);

// 🔥 EXPORT io
export { io };

// ❌ app.listen mat use karo
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
