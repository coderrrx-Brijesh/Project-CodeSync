import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = 3001;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Restrict in production for security
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000, // 60 seconds
  pingInterval: 10000, // 10 seconds
  transports: ["websocket", "polling"],
});

app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

// Track active rooms
const activeRooms = new Map();

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // ----- Room Management -----
  socket.on("create-room", ({ roomId, userId }) => {
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, { createdBy: userId, createdAt: new Date() });
    }
    socket.join(roomId);
    console.log(`Room ${roomId} created by ${userId}`);
    socket.emit("room-created", { roomId });
  });

  socket.on("join-room", ({ roomId, userId }) => {
    if (!activeRooms.has(roomId)) {
      console.log(`${userId} tried to join non-existent room ${roomId}`);
      socket.emit("room-error", { message: "This room does not exist" });
      return;
    }
    socket.join(roomId);
    console.log(`${userId} joined room ${roomId}`);
    socket.to(roomId).emit("user-connected", userId);
    // Request current file system from existing users
    socket.to(roomId).emit("request-file-system", { requestingUserId: userId });
  });

  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", { userId: socket.id });
    cleanupRoomIfEmpty(roomId);
  });

  // ----- File System Events -----
  socket.on("request-files", ({ roomId }) => {
    socket.to(roomId).emit("request-files", { roomId });
  });

  socket.on("share-files", ({ roomId, files }) => {
    io.in(roomId).emit("share-files", { files });
  });

  socket.on("share-file-system", ({ roomId, fileSystem, targetUserId }) => {
    io.to(targetUserId).emit("sync-file-system", { fileSystem, targetUserId });
  });

  // Broadcast file/folder operations to everyone (including sender)
  socket.on("file-created", ({ roomId, file, parentId }) => {
    io.in(roomId).emit("file-created", { file, parentId });
  });

  socket.on("folder-created", ({ roomId, folder, parentId }) => {
    io.in(roomId).emit("folder-created", { folder, parentId });
  });

  socket.on("file-updated", ({ roomId, fileId, content }) => {
    io.in(roomId).emit("file-updated", { fileId, content });
  });

  socket.on("file-renamed", ({ roomId, nodeId, newName }) => {
    io.in(roomId).emit("file-renamed", { nodeId, newName });
  });

  socket.on("file-deleted", ({ roomId, nodeId }) => {
    io.in(roomId).emit("file-deleted", { nodeId });
  });

  socket.on("file-moved", ({ roomId, nodeId, newParentId }) => {
    console.log(`File moved in ${roomId}: ${nodeId} -> ${newParentId}`);
    io.in(roomId).emit("file-moved", { nodeId, newParentId });
  });

  // ----- Chat & Code Sync -----
  socket.on("chat-message", ({ roomId, userId, message, timestamp }) => {
    io.in(roomId).emit("new-message", {
      chat: { userId, message, timestamp },
    });
  });

  socket.on("code-changed[FRONTEND]", ({ code, roomId }) => {
    socket.to(roomId).emit("code-changed[SERVER]", { code });
  });

  // ----- Cursor Movement -----
  socket.on("cursor-moved", ({ roomId, userId, x, y, username, color, clicking }) => {
    socket.to(roomId).emit("cursor-moved", { userId, x, y, username, color, clicking });
  });

  // ----- Disconnect -----
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
    activeRooms.forEach((_, roomId) => cleanupRoomIfEmpty(roomId));
  });
});

// Helper: Clean up room if no connected sockets remain
function cleanupRoomIfEmpty(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room || room.size === 0) {
    activeRooms.delete(roomId);
    console.log(`Room ${roomId} cleaned up (no active users)`);
  }
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
