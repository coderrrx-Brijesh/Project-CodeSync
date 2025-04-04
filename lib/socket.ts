"use client";

import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

type VideoUser = {
  userId: string;
  socketId: string;
};

interface RTCPeerConnectionWithUserId extends RTCPeerConnection {
  userId?: string;
}

class SocketManager {
  private static instance: SocketManager;
  private socket: Socket | null = null;
  private roomId: string | null = null;
  private userId: string;
  private lastEmittedCode: string = ""; // Prevent loops on code synchronization
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private peerConnections: Map<string, RTCPeerConnectionWithUserId> = new Map();
  private localStream: MediaStream | null = null;
  private onUserJoinedVideoCallback:
    | ((userId: string, socketId: string) => void)
    | null = null;
  private onUserLeftVideoCallback:
    | ((userId: string, socketId: string) => void)
    | null = null;
  private onRemoteStreamCallback:
    | ((userId: string, stream: MediaStream) => void)
    | null = null;

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
      this.socket = io("https://codesync-websocket-server.onrender.com", {
        transports: ["websocket", "polling"],
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        secure: true,
        rejectUnauthorized: process.env.NODE_ENV === "production",
      });
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
        this.socket = io("https://codesync-websocket-server.onrender.com", {
          transports: ["websocket", "polling"],
          reconnectionAttempts: Infinity,
          reconnectionDelay: 1000,
          secure: true,
          rejectUnauthorized: process.env.NODE_ENV === "production",
        });
        this.setupEventListeners();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      // Add a delay before attempting to reconnect to prevent rapid reconnection attempts
      setTimeout(() => {
        if (this.socket?.connected === false) {
          console.log("Attempting to reconnect...");
          // Close the current connection cleanly
          if (this.socket?.io?.engine?.transport) {
            this.socket.io.engine.transport.close();
          }
          this.socket?.disconnect();
          // Reconnect after a short delay
          this.socket?.connect();
        }
      }, 5000); // 5 second delay before reconnection attempt
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

    // ----- WebRTC Signaling -----
    this.socket.on("all-video-users", ({ users, roomId }) => {
      console.log("Received all video users in room:", users);
      // Create peer connections for all existing users in the room
      users.forEach((user: VideoUser) => {
        if (user.userId !== this.userId) {
          this.createPeerConnection(user.userId, user.socketId, true);
        }
      });
    });

    this.socket.on("user-joined-video", ({ userId, socketId }) => {
      console.log("User joined video call:", userId, socketId);
      // Create a peer connection for the new user
      this.createPeerConnection(userId, socketId, false);
      if (this.onUserJoinedVideoCallback) {
        this.onUserJoinedVideoCallback(userId, socketId);
      }
    });

    this.socket.on("user-left-video", ({ userId, socketId }) => {
      console.log("User left video call:", userId, socketId);
      // Clean up the peer connection with the user who left
      this.closePeerConnection(socketId);
      if (this.onUserLeftVideoCallback) {
        this.onUserLeftVideoCallback(userId, socketId);
      }
    });

    this.socket.on("offer", async ({ caller, sdp }) => {
      console.log("Received offer from:", caller);
      const peerConnection = this.peerConnections.get(caller);
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          this.socket?.emit("answer", {
            target: caller,
            caller: this.socket.id,
            sdp: peerConnection.localDescription,
          });
        } catch (error) {
          console.error("Error handling offer:", error);
        }
      }
    });

    this.socket.on("answer", async ({ caller, sdp }) => {
      console.log("Received answer from:", caller);
      const peerConnection = this.peerConnections.get(caller);
      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      }
    });

    this.socket.on("ice-candidate", ({ caller, candidate }) => {
      console.log("Received ICE candidate from:", caller);
      const peerConnection = this.peerConnections.get(caller);
      if (peerConnection) {
        try {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      }
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

  // ----- Video Call Methods -----
  async joinVideoCall(): Promise<MediaStream | null> {
    if (!this.socket || !this.roomId) return null;

    try {
      // Check if we're in a browser environment with media device support
      if (
        typeof window === "undefined" ||
        !navigator ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        console.error("MediaDevices API not supported in this environment");
        throw new Error(
          "Your browser doesn't support video calls. Please try using Chrome, Firefox, or Edge."
        );
      }

      // Request user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // Emit event to join the video call
      this.socket.emit("join-video-call", {
        roomId: this.roomId,
        userId: this.userId,
      });

      return this.localStream;
    } catch (error) {
      // Provide more user-friendly error messages
      let errorMessage = "Error joining video call";

      if (error instanceof Error) {
        if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          errorMessage =
            "Camera or microphone access denied. Please allow access to use video calls.";
        } else if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          errorMessage =
            "No camera or microphone found. Please connect a device and try again.";
        } else if (
          error.name === "NotReadableError" ||
          error.name === "TrackStartError"
        ) {
          errorMessage =
            "Could not access your camera or microphone. They might be in use by another application.";
        } else if (error.name === "OverconstrainedError") {
          errorMessage = "Your camera doesn't meet the required constraints.";
        } else if (error.message) {
          errorMessage = error.message;
        }
      }

      console.error(errorMessage, error);
      return null;
    }
  }

  leaveVideoCall(): void {
    if (!this.socket || !this.roomId) return;

    // Stop all tracks in local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Close all peer connections
    this.peerConnections.forEach((pc, socketId) => {
      this.closePeerConnection(socketId);
    });

    // Emit event to leave the video call
    this.socket.emit("leave-video-call", {
      roomId: this.roomId,
      userId: this.userId,
    });
  }

  private createPeerConnection(
    userId: string,
    socketId: string,
    isInitiator: boolean
  ): RTCPeerConnectionWithUserId | null {
    if (!this.socket || !this.localStream) return null;

    // Check if we already have a connection with this peer
    if (this.peerConnections.has(socketId)) {
      return this.peerConnections.get(socketId) || null;
    }

    // ICE servers for STUN/TURN
    const iceServers = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
      ],
    };

    // Create a new RTCPeerConnection
    const peerConnection: RTCPeerConnectionWithUserId = new RTCPeerConnection(
      iceServers
    );
    peerConnection.userId = userId;

    // Add the local stream to the peer connection
    this.localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, this.localStream!);
    });

    // Set up ICE candidate handling
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket?.emit("ice-candidate", {
          target: socketId,
          caller: this.socket.id,
          candidate: event.candidate,
        });
      }
    };

    // Handle when a new remote stream is received
    peerConnection.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        console.log("Received remote stream from:", userId);
        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(userId, event.streams[0]);
        }
      }
    };

    // Store the peer connection
    this.peerConnections.set(socketId, peerConnection);

    // If initiator, create and send an offer
    if (isInitiator) {
      this.createAndSendOffer(socketId, peerConnection);
    }

    return peerConnection;
  }

  private async createAndSendOffer(
    socketId: string,
    peerConnection: RTCPeerConnection
  ): Promise<void> {
    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      this.socket?.emit("offer", {
        target: socketId,
        caller: this.socket.id,
        sdp: peerConnection.localDescription,
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }

  private closePeerConnection(socketId: string): void {
    const peerConnection = this.peerConnections.get(socketId);
    if (peerConnection) {
      peerConnection.close();
      this.peerConnections.delete(socketId);
    }
  }

  // Callbacks for video call events
  setOnUserJoinedVideoCallback(
    callback: (userId: string, socketId: string) => void
  ): void {
    this.onUserJoinedVideoCallback = callback;
  }

  setOnUserLeftVideoCallback(
    callback: (userId: string, socketId: string) => void
  ): void {
    this.onUserLeftVideoCallback = callback;
  }

  setOnRemoteStreamCallback(
    callback: (userId: string, stream: MediaStream) => void
  ): void {
    this.onRemoteStreamCallback = callback;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
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
