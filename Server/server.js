import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import https from "https";
import fs from "fs"
const app = express();
const PORT = process.env.NEXT_PUBLIC_SOCKET_PORT || 3001;

const key = fs.readFileSync('cert.key')
const cert = fs.readFileSync('cert.crt')

const expressServer = https.createServer({key,cert},app);

const io = new Server(expressServer, {
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
const socketToRoom = new Map();
// Track users in video calls for each room
const videoCallUsers = new Map();

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // ----- Room Management -----
  socket.on("create-room", ({ roomId, userId }) => {
    if (!activeRooms.has(roomId)) {
      activeRooms.set(roomId, { createdBy: userId, createdAt: new Date() });
      socketToRoom.set(socket.id, roomId);
    }
    socket.join(roomId);
    io.to(roomId).emit("active-user-update", {
      activeUsers: io.sockets.adapter.rooms.get(roomId).size,
    });
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
    io.to(roomId).emit("active-user-update", {
      activeUsers: io.sockets.adapter.rooms.get(roomId).size,
    });
    socketToRoom.set(socket.id, roomId);
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
  socket.on(
    "cursor-moved",
    ({ roomId, userId, x, y, username, color, clicking }) => {
      socket
        .to(roomId)
        .emit("cursor-moved", { userId, x, y, username, color, clicking });
    }
  );

  // ----- WebRTC Signaling for Video Calls -----
  socket.on("join-video-call", ({ roomId, userId }) => {
    console.log(`User ${userId} is joining video call in room ${roomId}`);
    
    // Initialize users array for this room if it doesn't exist
    if (!videoCallUsers.has(roomId)) {
      videoCallUsers.set(roomId, []);
    }
    
    const usersInRoom = videoCallUsers.get(roomId);
    
    // Send existing users to the joining user
    socket.emit("all-video-users", {
      users: usersInRoom,
      roomId,
    });
    
    // Add the joining user to the room's user list
    const newUser = { userId, socketId: socket.id };
    videoCallUsers.set(roomId, [...usersInRoom, newUser]);
    
    // Notify all users in the room about the new user
    socket.to(roomId).emit("user-joined-video", {
      userId,
      socketId: socket.id,
    });
  });

  socket.on("leave-video-call", ({ roomId, userId }) => {
    console.log(`User ${userId} is leaving video call in room ${roomId}`);
    
    if (videoCallUsers.has(roomId)) {
      // Remove the user from the room's user list
      const usersInRoom = videoCallUsers.get(roomId);
      const updatedUsers = usersInRoom.filter(user => user.socketId !== socket.id);
      
      if (updatedUsers.length === 0) {
        videoCallUsers.delete(roomId);
      } else {
        videoCallUsers.set(roomId, updatedUsers);
      }
      
      // Notify all users in the room that this user left
      socket.to(roomId).emit("user-left-video", {
        userId,
        socketId: socket.id,
      });
    }
  });

  socket.on("offer", ({ target, caller, sdp }) => {
    console.log(`Sending offer from ${caller} to ${target}`);
    io.to(target).emit("offer", {
      caller,
      sdp,
    });
  });

  socket.on("answer", ({ target, caller, sdp }) => {
    console.log(`Sending answer from ${caller} to ${target}`);
    io.to(target).emit("answer", {
      caller,
      sdp,
    });
  });

  socket.on("ice-candidate", ({ target, candidate, caller }) => {
    console.log(`Sending ICE candidate from ${caller} to ${target}`);
    io.to(target).emit("ice-candidate", {
      caller,
      candidate,
    });
  });

  // ----- Disconnect -----
  socket.on("disconnect", () => {
    const roomId = socketToRoom.get(socket.id);
    if (io && roomId) {
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        io.to(roomId).emit("active-user-update", { activeUsers: room.size });
      }
      
      // Handle disconnection from video call
      if (videoCallUsers.has(roomId)) {
        const usersInRoom = videoCallUsers.get(roomId);
        const disconnectedUser = usersInRoom.find(user => user.socketId === socket.id);
        
        if (disconnectedUser) {
          // Notify others in the room that this user left the video call
          socket.to(roomId).emit("user-left-video", {
            userId: disconnectedUser.userId,
            socketId: socket.id,
          });
          
          // Remove the user from the room's user list
          const updatedUsers = usersInRoom.filter(user => user.socketId !== socket.id);
          
          if (updatedUsers.length === 0) {
            videoCallUsers.delete(roomId);
          } else {
            videoCallUsers.set(roomId, updatedUsers);
          }
        }
      }
    }
    console.log("User Disconnected:", socket.id);
    activeRooms.forEach((_, roomId) => cleanupRoomIfEmpty(roomId));
  });
});

// Helper: Clean up room if no connected sockets remain
function cleanupRoomIfEmpty(roomId) {
  const room = io.sockets.adapter.rooms.get(roomId);
  if (!room || room.size === 0) {
    activeRooms.delete(roomId);
    videoCallUsers.delete(roomId);
    console.log(`Room ${roomId} cleaned up (no active users)`);
  }
}

expressServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
