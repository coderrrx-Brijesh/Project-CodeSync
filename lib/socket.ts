import { use, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private userId: string;
  private lastEmittedCode: string = ""; // Store last emitted code to prevent loops

  private constructor() {
    this.userId = uuidv4();
  }

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect() {
    if (!this.socket) {
      fetch("/api/socket").catch(console.error);

      this.socket = io("192.168.137.1:3002", {
        transports: ["websocket", "polling"], // Allow both WebSocket and polling
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.setupEventListeners();
    }
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    this.socket.on("code-changed[SERVER]", ({ code }: { code: string }) => {
      if (code !== this.lastEmittedCode) {
        this.lastEmittedCode = code; // Update last emitted code
      }
    });
  }

  joinRoom(roomId: string) {
    if (!this.socket) return;
    this.roomId = roomId;
    this.socket.emit("join-room", { roomId, userId: this.userId });
  }

  createRoom(): string {
    const newRoomId = uuidv4().slice(0, 8);
    this.joinRoom(newRoomId);
    return newRoomId;
  }

  leaveRoom() {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("leave-room", {
      roomId: this.roomId,
      userId: this.userId,
    });
    this.roomId = null;
  }

  sendMessage(message: string) {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("chat-message", {
      roomId: this.roomId,
      userId: this.userId,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  changeCode(code: string) {
    if (!this.socket || !this.roomId) return;

    // 🔥 Prevent re-emitting the same code
    if (code !== this.lastEmittedCode) {
      this.lastEmittedCode = code;
      this.socket.emit("code-changed[FRONTEND]", { code, roomId: this.roomId });
    }
  }

  onMessage(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on("chat-message", callback);
  }

  getUserId(): string {
    return this.userId;
  }

  getRoomId(): string | null {
    return this.roomId;
  }
}

export const socketManager = SocketManager.getInstance();
