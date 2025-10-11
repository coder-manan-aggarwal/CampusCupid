// server/index.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import exploreRoutes from "./routes/exploreRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import datingRoutes from "./routes/datingRoutes.js";
import privateChatRoutes from "./routes/privateChatRoutes.js";
import loungeRoutes from "./routes/loungeRoutes.js";
import messagesRoutes from "./routes/messagesRoutes.js";

import { createServer } from "http";
import { Server } from "socket.io";
import authMiddleware from "./middleware/authMiddleware.js";
import { setIO } from "./utils/socketEmitter.js";
import campusUpdateRoutes from "./routes/campusUpdateRoute.js";
import pollRoutes from "./routes/pollRoutes.js";
import userSearchRoutes from "./routes/userSearchRoutes.js";
import matchSearchRoutes from "./routes/matchSearchRoutes.js";
import askoutSearchRoutes from "./routes/askoutSearchRoutes.js";
import confessionSearchRoutes from "./routes/confessionSearchRoutes.js";



// ------------------- Express Setup -------------------
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ------------------- Routes -------------------
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/explore", exploreRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dating", authMiddleware, datingRoutes);
app.use("/api/private-chat", privateChatRoutes);
app.use("/api/lounges", loungeRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/users", userSearchRoutes);
app.use("/api/dating/matches", matchSearchRoutes);
app.use("/api/dating/askouts", askoutSearchRoutes);
app.use("/api/dating/confession", confessionSearchRoutes);
app.use("/api/campus-updates", campusUpdateRoutes);
console.log("Loaded CHAT_SECRET_KEY:", process.env.CHAT_SECRET_KEY);

// ------------------- Socket.io Setup -------------------
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: [import.meta.env.VITE_FRONTEND_URL,
      "http://localhost:5173",], // ⚠️ adjust if frontend runs elsewhere
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setIO(io);

// ✅ Track online users
const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // --- Online Status ---
  socket.on("registerUser", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("userOnline", userId); // notify everyone
    console.log(`User ${userId} is online`);
  });

  socket.on("disconnect", () => {
    const userId = [...onlineUsers.entries()].find(
      ([, sid]) => sid === socket.id
    )?.[0];
    if (userId) {
      onlineUsers.delete(userId);
      io.emit("userOffline", userId); // notify everyone
      console.log(`User ${userId} went offline`);
    }
    console.log("🔴 User disconnected:", socket.id);
  });

  // --- Typing Indicators ---
  socket.on("typing", ({ matchId, userId }) => {
    socket.to(matchId).emit("typing", { matchId, userId });
  });

  socket.on("stopTyping", ({ matchId, userId }) => {
    socket.to(matchId).emit("stopTyping", { matchId, userId });
  });

  // --- Lounge Chat ---
  socket.on("joinLounge", (loungeId) => {
    socket.join(loungeId);
    console.log(`User ${socket.id} joined lounge ${loungeId}`);
  });

  socket.on("sendLoungeMessage", (msg) => {
    io.to(msg.loungeId).emit("receiveLoungeMessage", msg);
  });

  // --- Private Chat ---
  socket.on("joinPrivateChat", (matchId) => {
    socket.join(matchId);
    console.log(`User ${socket.id} joined private chat ${matchId}`);
  });

  socket.on("sendPrivateMessage", (msg) => {
    io.to(msg.matchId).emit("receivePrivateMessage", msg);
  });
});

// ------------------- Start Server -------------------
connectDB().then(() => {
  httpServer.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});
