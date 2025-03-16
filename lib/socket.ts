"use client";

import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private userId: string;
  private lastEmittedCode: string = ""; // Prevent loops on code synchronization
  private heartbeatInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.userId = uuidv4();
  }

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
        {
          transports: ["websocket", "polling"],
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
        }
      );
      this.setupEventListeners();
      this.startHeartbeat();
    }
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server:", this.socket?.id);
      if (this.roomId) {
        this.joinRoom(this.roomId);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      if (reason === "io server disconnect" && this.socket) {
        if (this.socket.io?.engine?.transport) {
          this.socket.io.engine.transport.close();
        }
        this.socket.disconnect();
        this.socket = io(
          process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
          {
            transports: ["websocket"],
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
          }
        );
        this.setupEventListeners();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      if (this.socket?.io?.engine?.transport) {
        this.socket.io.engine.transport.close();
        this.socket.disconnect();
        this.socket.connect();
      }
    });

    // ----- Code Sync -----
    this.socket.on("code-changed[SERVER]", ({ code }) => {
      if (code !== this.lastEmittedCode) {
        this.lastEmittedCode = code;
        // Optionally update the local code editor
      }
    });

    // ----- File System Events -----
    this.socket.on("file-created", ({ file, parentId }) => {
      console.log("Received file-created:", file.name);
      const { fileSystem } = require("./file-system");
      fileSystem.addReceivedFile(file, parentId);
    });

    this.socket.on("folder-created", ({ folder, parentId }) => {
      const { fileSystem } = require("./file-system");
      fileSystem.addExistingFolder(folder, parentId);
    });

    this.socket.on("file-updated", ({ fileId, content }) => {
      console.log("Received file-updated:", fileId);
      const { fileSystem } = require("./file-system");
      fileSystem.updateFileWithoutEmit(fileId, content);
    });

    this.socket.on("file-renamed", ({ nodeId, newName }) => {
      console.log("Received file-renamed:", nodeId, newName);
      const { fileSystem } = require("./file-system");
      fileSystem.renameWithoutEmit(nodeId, newName);
    });

    this.socket.on("file-deleted", ({ nodeId }) => {
      console.log("Received file-deleted:", nodeId);
      const { fileSystem } = require("./file-system");
      fileSystem.deleteWithoutEmit(nodeId);
    });

    this.socket.on("file-moved", ({ nodeId, newParentId }) => {
      console.log("Received file-moved:", nodeId, newParentId);
      const { fileSystem } = require("./file-system");
      fileSystem.moveWithoutEmit(nodeId, newParentId);
    });

    // ----- Request/Share Files -----
    this.socket.on("request-files", ({ roomId }) => {
      if (this.roomId === roomId) {
        const { fileSystem } = require("./file-system");
        const files = fileSystem.getSerializableFiles();
        this.socket?.emit("share-files", { roomId, files });
      }
    });

    this.socket.on("share-files", ({ files }) => {
      const { fileSystem } = require("./file-system");
      fileSystem.importFiles(files);
    });

    this.socket.on("request-file-system", ({ requestingUserId }) => {
      if (this.roomId) {
        const { fileSystem } = require("./file-system");
        const files = fileSystem.getFiles();
        this.socket?.emit("share-file-system", {
          roomId: this.roomId,
          fileSystem: files,
          targetUserId: requestingUserId,
        });
      }
    });

    this.socket.on("sync-file-system", ({ fileSystem, targetUserId }) => {
      if (targetUserId === this.userId) {
        const { fileSystem: fsInstance } = require("./file-system");
        fsInstance.syncFiles(fileSystem);
      }
    });

    // ----- Cursor Movement -----
    this.socket.on("cursor-moved", (data) => {
      console.log("Received cursor-moved:", data);
      // Update local cursor UI if needed
    });

    // ----- Room/Chat -----
    this.socket.on("user-left", ({ userId }) => {
      console.log("User left:", userId);
    });
  }

  createRoom(): string {
    const roomId = uuidv4().substring(0, 8);
    if (!this.socket) this.connect();
    this.roomId = roomId;
    this.socket?.emit("create-room", { roomId, userId: this.userId });
    return roomId;
  }

  joinRoom(roomId: string): void {
    if (!this.socket) this.connect();
    this.roomId = roomId;
    this.socket?.emit("join-room", { roomId, userId: this.userId });
    this.socket?.emit("request-files", { roomId });
  }

  leaveRoom(): void {
    if (this.socket && this.roomId) {
      this.socket.emit("leave-room", { roomId: this.roomId });
      this.roomId = null;
    }
  }

  sendMessage(message: string): void {
    if (!this.socket || !this.roomId) return;
    const timestamp = new Date().toISOString();
    this.socket.emit("chat-message", {
      roomId: this.roomId,
      userId: this.userId,
      message,
      timestamp,
    });
  }

  changeCode(code: string): void {
    if (!this.socket || !this.roomId) return;
    if (code !== this.lastEmittedCode) {
      this.lastEmittedCode = code;
      this.socket.emit("code-changed[FRONTEND]", {
        roomId: this.roomId,
        code,
      });
    }
  }

  // ----- File Methods -----
  fileCreated(file: any, parentId: string | null): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("file-created", { roomId: this.roomId, file, parentId });
  }

  folderCreated(folder: any, parentId: string | null): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("folder-created", { roomId: this.roomId, folder, parentId });
  }

  fileUpdated(fileId: string, content: string): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("file-updated", { roomId: this.roomId, fileId, content });
  }

  fileRenamed(nodeId: string, newName: string): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("file-renamed", { roomId: this.roomId, nodeId, newName });
  }

  fileDeleted(nodeId: string): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("file-deleted", { roomId: this.roomId, nodeId });
  }

  fileMoved(nodeId: string, newParentId: string | null): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("file-moved", { roomId: this.roomId, nodeId, newParentId });
  }

  cursorMoved(
    x: number,
    y: number,
    username: string,
    color: string,
    clicking: boolean = false
  ): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("cursor-moved", {
      roomId: this.roomId,
      userId: this.userId,
      x,
      y,
      username,
      color,
      clicking,
    });
  }

  // ----- Heartbeat -----
  private startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && !this.socket.connected) {
        console.log("Heartbeat: socket disconnected, reconnecting...");
        this.socket.connect();
      }
    }, 30000);
  }

  disconnect(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getUserId(): string {
    return this.userId;
  }

  getRoomId(): string | null {
    return this.roomId;
  }
}

export const socketManager = SocketManager.getInstance();
