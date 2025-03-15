"use client";

import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private userId: string;
  private lastEmittedCode: string = ""; // Store last emitted code to prevent loops
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // callback setters for updating video streams in the UI

  public setLocalStreamCallback: (stream: MediaStream) => void=()=>{}
  public setRemoteStreamCallback: (stream: MediaStream) => void=()=>{}
  
  private userName = "Coderrr-"+Math.floor(Math.random()*100000);
  private password = "x"
  

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
    auth:{
      this.userName,this.password
    }
    if (!this.socket) {
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://localhost:3001", {
        transports: ["websocket","polling"], // Use websocket only from the start
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
      });
      this.setupEventListeners();
    }
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Connected to WebSocket server with ID:", this.socket?.id);
      // Rejoin room if we were in one
      if (this.roomId) {
        this.joinRoom(this.roomId);
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Disconnected from WebSocket server, reason:", reason);

      // If the disconnection was not intentional, attempt to reconnect
      if (reason === "io server disconnect" && this.socket) {
        // If the server disconnected us, try to reconnect manually
        if (
          this.socket.io &&
          this.socket.io.engine &&
          this.socket.io.engine.transport
        ) {
          this.socket.io.engine.transport.close();
        }
        this.socket.disconnect();

        // Recreate socket with websocket transport
        this.socket = io(
          process.env.NEXT_PUBLIC_SOCKET_URL || "https://localhost:3001",
          {
            transports: ["websocket","polling"],
            reconnectionAttempts: Infinity,
            reconnectionDelay:1000
          }
        );

        this.setupEventListeners();
      }
      // Otherwise, the socket will automatically try to reconnect
    });

    // // Add connection error handling
    // this.socket.on("connect_error", (error) => {
    //   console.error("Connection error:", error);
    // });
    


    // adding video call handlers
        // Example: Receiving a local stream (this event should be triggered by your WebRTC logic)
        this.socket.on("local-stream", (data: { stream: MediaStream }) => {
          console.log("Received local stream");
          this.setLocalStreamCallback(data.stream);
        });
    
        // Example: Receiving a remote stream
        this.socket.on("remote-stream", (data: { stream: MediaStream }) => {
          console.log("Received remote stream");
          this.setRemoteStreamCallback(data.stream);
        });

    // Add handlers for file system events
    this.socket.on(
      "request-file-system",
      ({ requestingUserId }: { requestingUserId: string }) => {
        if (this.roomId) {
          // Import and use fileSystem to get current files
          const { fileSystem } = require("./file-system");
          const files = fileSystem.getFiles();
          this.socket?.emit("share-file-system", {
            roomId: this.roomId,
            fileSystem: files,
            targetUserId: requestingUserId,
          });
        }
      }
    );

    this.socket.on(
      "sync-file-system",
      ({
        fileSystem,
        targetUserId,
      }: {
        fileSystem: any;
        targetUserId: string;
      }) => {
        // Only apply if this is the target user
        if (targetUserId === this.userId) {
          const { fileSystem: fsInstance } = require("./file-system");
          fsInstance.syncFiles(fileSystem);
        }
      }
    );

    this.socket.on(
      "file-created",
      ({ file, parentId }: { file: any; parentId: string | null }) => {
        console.log("Received file-created event:", file.name);
        const { fileSystem } = require("./file-system");
        fileSystem.addReceivedFile(file, parentId);
      }
    );

    this.socket.on(
      "folder-created",
      ({ folder, parentId }: { folder: any; parentId: string | null }) => {
        const { fileSystem } = require("./file-system");
        fileSystem.addExistingFolder(folder, parentId);
      }
    );

    this.socket.on(
      "file-updated",
      ({ fileId, content }: { fileId: string; content: string }) => {
        console.log("Received file-updated event for:", fileId);
        const { fileSystem } = require("./file-system");
        fileSystem.updateFileWithoutEmit(fileId, content);
      }
    );

    this.socket.on(
      "file-renamed",
      ({ nodeId, newName }: { nodeId: string; newName: string }) => {
        console.log(
          "Received file-renamed event for:",
          nodeId,
          "new name:",
          newName
        );
        const { fileSystem } = require("./file-system");
        fileSystem.renameWithoutEmit(nodeId, newName);
      }
    );

    this.socket.on("file-deleted", ({ nodeId }: { nodeId: string }) => {
      console.log("Received file-deleted event for:", nodeId);
      const { fileSystem } = require("./file-system");
      fileSystem.deleteWithoutEmit(nodeId);
    });

    this.socket.on(
      "file-moved",
      ({
        nodeId,
        newParentId,
      }: {
        nodeId: string;
        newParentId: string | null;
      }) => {
        const { fileSystem } = require("./file-system");
        fileSystem.moveWithoutEmit(nodeId, newParentId);
      }
    );

    // Add file synchronization event listeners
    this.socket.on("request-files", ({ roomId }) => {
      if (this.roomId === roomId) {
        // Import fileSystem only when needed to avoid circular dependencies
        const { fileSystem } = require("./file-system");
        const files = fileSystem.getSerializableFiles();

        this.socket?.emit("share-files", {
          roomId,
          files,
        });
      }
    });

    this.socket.on("share-files", ({ files }) => {
      // Import fileSystem only when needed
      const { fileSystem } = require("./file-system");
      fileSystem.importFiles(files);
    });

    this.socket.on("file-created", ({ file, parentId }) => {
      console.log("Received file-created event:", file.name);
      const { fileSystem } = require("./file-system");
      fileSystem.addReceivedFile(file, parentId);
    });

    this.socket.on("file-updated", ({ fileId, content }) => {
      console.log("Received file-updated event for:", fileId);
      const { fileSystem } = require("./file-system");
      fileSystem.updateFileWithoutEmit(fileId, content);
    });

    this.socket.on("file-deleted", ({ nodeId }) => {
      console.log("Received file-deleted event for:", nodeId);
      const { fileSystem } = require("./file-system");
      fileSystem.deleteWithoutEmit(nodeId);
    });

    // Similar listeners for rename and move operations...
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

    // Request files immediately instead of using setTimeout
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

    // Only emit if the code has changed
    if (code !== this.lastEmittedCode) {
      this.lastEmittedCode = code;
      this.socket.emit("code-changed[FRONTEND]", {
        roomId: this.roomId,
        code,
      });
    }
  }

  getUserId(): string {
    return this.userId;
  }

  getRoomId(): string | null {
    return this.roomId;
  }

  // Add new methods for file system operations
  fileCreated(file: any, parentId: string | null): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("file-created", { roomId: this.roomId, file, parentId });
  }

  folderCreated(folder: any, parentId: string | null): void {
    if (!this.socket || !this.roomId) return;
    this.socket.emit("folder-created", {
      roomId: this.roomId,
      folder,
      parentId,
    });
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
    this.socket.emit("file-moved", {
      roomId: this.roomId,
      nodeId,
      newParentId,
    });
  }

  private startHeartbeat() {
    // Clear any existing heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // Check connection status every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && !this.socket.connected) {
        console.log("Heartbeat detected disconnected socket, reconnecting...");
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



  // video call code 
}

export const socketManager = SocketManager.getInstance();
