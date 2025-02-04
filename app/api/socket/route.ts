import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextResponse } from "next/server";
import { createServer } from "http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let io: ServerIO;
let httpServer: NetServer;

export async function GET(request: Request) {
  if (!io) {
    console.log("New Socket.io server...");

    // Create HTTP server if it doesn't exist
    if (!httpServer) {
      httpServer = createServer();
      httpServer.listen(3001); // Use a different port from your Next.js app
    } else {
      console.log("Socket.io server already running");
    }
    // Initialize Socket.IO with the HTTP server
    io = new ServerIO(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true,
      },
      transports: ["websocket", "polling"], // Allow both WebSocket and polling
      allowEIO3: true, // Enable compatibility mode
    });

    io.on("connection", (socket) => {
      console.log(`User Connected: ${socket.id}`);

      socket.on("join-room", ({ roomId, userId }) => {
        socket.join(roomId);
        console.log(`${userId} joined room ${roomId}`);
        socket.to(roomId).emit("user-connected", userId);
      });

      socket.on("chat-message", ({ roomId, userId, message, timestamp }) => {
        io.in(roomId).emit("new-message", {
          chat: { userId, message, timestamp },
        });
      });

      socket.on("code-changed[FRONTEND]", ({ code, roomId }) => {
        socket.to(roomId).emit("code-changed[SERVER]", { code });
      });

      socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
      });
    });
  }

  return NextResponse.json(
    { success: true, message: "Socket server running" },
    { status: 200 }
  );
}

export const POST = GET;
