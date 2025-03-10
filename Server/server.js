// Import the required modules
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

const app = express();
const PORT = 3001;

const server = http.createServer(app);

// Configure Socket.IO with better connection settings
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  // Connection settings
  pingTimeout: 60000, // 60 seconds
  pingInterval: 10000, // 10 seconds
  transports: ["websocket", "polling"],
});

app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

// active rooms
const activeRooms = new Map();

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // Room management
  socket.on("create-room", ({ roomId, userId }) => {
    activeRooms.set(roomId, { createdBy: userId, createdAt: new Date() });
    socket.join(roomId);
    console.log(`Room ${roomId} created by ${userId}`);
    socket.emit("room-created", { roomId });
  });

  socket.on("join-room", ({ roomId, userId }) => {
    // Check if the room exists
    if (!activeRooms.has(roomId)) {
      console.log(`${userId} attempted to join non-existent room ${roomId}`);
      socket.emit("room-error", { message: "This room does not exist" });
      return;
    }

    socket.join(roomId);
    console.log(`${userId} joined room ${roomId}`);
    socket.to(roomId).emit("user-connected", userId);

    // Request current file system from the room
    socket.to(roomId).emit("request-file-system", { requestingUserId: userId });
  });

  // File system sharing
  socket.on("request-files", ({ roomId }) => {
    // Forward request to all users in the room
    socket.to(roomId).emit("request-files", { roomId });
  });

  socket.on("share-files", ({ roomId, files }) => {
    // Forward shared files to all users in the room except sender
    socket.to(roomId).emit("share-files", { files });
  });

  socket.on("share-file-system", ({ roomId, fileSystem, targetUserId }) => {
    // Send file system structure to the specific user who requested it
    io.to(roomId).emit("sync-file-system", { fileSystem, targetUserId });
  });

  // File operations synchronization
  socket.on("file-created", ({ roomId, file, parentId }) => {
    socket.volatile.to(roomId).emit("file-created", { file, parentId });
  });

  socket.on("folder-created", ({ roomId, folder, parentId }) => {
    socket.to(roomId).emit("folder-created", { folder, parentId });
  });

  socket.on("file-updated", ({ roomId, fileId, content }) => {
    socket.volatile.to(roomId).emit("file-updated", { fileId, content });
  });

  socket.on("file-renamed", ({ roomId, nodeId, newName }) => {
    socket.volatile.to(roomId).emit("file-renamed", { nodeId, newName });
  });

  socket.on("file-deleted", ({ roomId, nodeId }) => {
    socket.volatile.to(roomId).emit("file-deleted", { nodeId });
  });

  socket.on("file-moved", ({ roomId, nodeId, newParentId }) => {
    console.log(
      `File moved in room ${roomId}: ${nodeId} to parent ${newParentId}`
    );
    socket.to(roomId).emit("file-moved", { nodeId, newParentId });
  });

  // Chat messaging
  socket.on("chat-message", ({ roomId, userId, message, timestamp }) => {
    // Log for debugging
    console.log(
      `Chat message in room ${roomId} from user ${userId}: ${message}`
    );

    // Make sure to broadcast to everyone in the room, including sender for consistency
    io.in(roomId).emit("new-message", {
      chat: { userId: userId, message: message, timestamp: timestamp },
    });
  });

  // Code synchronization
  socket.on("code-changed[FRONTEND]", ({ code, roomId }) => {
    socket.to(roomId).emit("code-changed[SERVER]", { code: code });
  });


// Add to your existing socket handlers

// Handle cursor movement
// Update your existing cursor-moved handler

socket.on("cursor-moved", ({ roomId, userId, x, y, username, color, clicking }) => {
  // Broadcast cursor position with all properties to all other users in the room
  socket.to(roomId).emit("cursor-moved", { 
    userId, 
    x, 
    y, 
    username, 
    color, 
    clicking 
  });
});

// Modify your existing leave-room handler to also emit a user-left event
socket.on("leave-room", ({ roomId }) => {
  socket.leave(roomId);
  socket.to(roomId).emit("user-left", { userId: socket.id });
});

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
