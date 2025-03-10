"use client";

import { v4 as uuidv4 } from "uuid";
import { socketManager } from "@/lib/socket";
import { debounce } from "lodash";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  children?: FileNode[];
  parentId?: string;
  extension?: string;
  createdAt: Date;
  updatedAt: Date;
}

class FileSystem {
  private static instance: FileSystem;
  private files: FileNode[];
  private initialized: boolean = false;
  private userId: string = "";
  private changeListeners: Array<() => void> = [];

  private constructor() {
    this.files = [];
    // Get the user ID from socket manager
    this.userId = socketManager.getUserId();
  }

  private getStorageKey(): string {
    return `fileSystem_${this.userId}`;
  }

  private initialize() {
    if (this.initialized) return;

    // Update userId in case it wasn't available during construction
    this.userId = socketManager.getUserId();

    try {
      // Use user-specific key for localStorage
      const savedFiles = localStorage.getItem(this.getStorageKey());
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        // Convert string dates back to Date objects
        this.files = this.convertDates(parsedFiles);
      } else {
        // Start with empty file system for new users
        this.files = [];
      }
    } catch (error) {
      console.error("Error initializing FileSystem:", error);
      this.files = [];
    }

    this.initialized = true;
  }

  private createDefaultStructure() {
    // Create a root folder
    const rootFolder: FileNode = {
      id: uuidv4(),
      name: "My Project",
      type: "folder",
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add some default files
    const mainJsFile: FileNode = {
      id: uuidv4(),
      name: "main.js",
      type: "file",
      content:
        "// Write your JavaScript code here\nconsole.log('Hello, world!');\n",
      extension: "js",
      parentId: rootFolder.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const readmeFile: FileNode = {
      id: uuidv4(),
      name: "README.md",
      type: "file",
      content: "# My Project\n\nWelcome to CodeSync!\n",
      extension: "md",
      parentId: rootFolder.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    rootFolder.children = [mainJsFile, readmeFile];
    this.files = [rootFolder];
    this.saveToStorage();
  }

  private convertDates(nodes: any[]): FileNode[] {
    return nodes.map((node) => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
      children: node.children ? this.convertDates(node.children) : undefined,
    }));
  }

  static getInstance(): FileSystem {
    if (!FileSystem.instance) {
      FileSystem.instance = new FileSystem();
    }
    return FileSystem.instance;
  }

  getFiles(): FileNode[] {
    if (typeof window !== "undefined" && !this.initialized) {
      this.initialize();
    }
    return this.files;
  }

  findNode(id: string, nodes: FileNode[] = this.files): FileNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = this.findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  }

  createFile(parentId: string | null, name: string): FileNode {
    const extension = name.split(".").pop() || "";
    const newFile: FileNode = {
      id: uuidv4(),
      name,
      type: "file",
      content: "",
      extension,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      const parent = this.findNode(parentId);
      if (parent && parent.type === "folder") {
        // Check for duplicate names in the parent folder
        if (parent.children?.some((child) => child.name === name)) {
          throw new Error("File already exists in this folder");
        }
        parent.children = parent.children || [];
        parent.children.push(newFile);
        newFile.parentId = parentId;
      } else {
        throw new Error("Parent folder not found");
      }
    } else {
      // Check for duplicate names in root
      if (this.files.some((node) => node.name === name)) {
        throw new Error("File already exists in root");
      }
      this.files.push(newFile);
    }

    this.saveToStorage();
    this.notifyChangeListeners();

    // Emit immediately without debounce
    const roomId = socketManager.getRoomId();
    if (roomId) {
      socketManager.connect().emit("file-created", {
        roomId,
        file: JSON.parse(JSON.stringify(newFile)),
        parentId,
      });
    }

    return newFile;
  }

  createFolder(parentId: string | null, name: string): FileNode {
    const newFolder: FileNode = {
      id: uuidv4(),
      name,
      type: "folder",
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (parentId) {
      const parent = this.findNode(parentId);
      if (parent && parent.type === "folder") {
        // Check for duplicate names in the parent folder
        if (parent.children?.some((child) => child.name === name)) {
          throw new Error("Folder already exists in this folder");
        }
        parent.children = parent.children || [];
        parent.children.push(newFolder);
        newFolder.parentId = parentId;
      } else {
        throw new Error("Parent folder not found");
      }
    } else {
      // Check for duplicate names in root
      if (this.files.some((node) => node.name === name)) {
        throw new Error("Folder already exists in root");
      }
      this.files.push(newFolder);
    }

    this.saveToStorage();
    this.notifyChangeListeners();
    // Emit event to synchronize with other users
    socketManager.folderCreated(newFolder, parentId);
    return newFolder;
  }

  updateFile(id: string, content: string): boolean {
    const file = this.findNode(id);
    if (!file || file.type !== "file") return false;

    file.content = content;
    file.updatedAt = new Date();
    this.saveToStorage();

    // Use debounced emit for content updates
    this.debouncedEmitContentChange(id, content);

    return true;
  }

  // Debounced method for content updates only (300ms is usually a good balance)
  private debouncedEmitContentChange = debounce(
    (fileId: string, content: string) => {
      const roomId = socketManager.getRoomId();
      if (roomId) {
        socketManager.connect().emit("file-updated", {
          roomId,
          fileId,
          content,
        });
      }
    },
    300
  );

  // Version without emitting events (to prevent loops)
  updateFileWithoutEmit(id: string, content: string): boolean {
    const file = this.findNode(id);
    if (!file || file.type !== "file") return false;
    file.content = content;
    file.updatedAt = new Date();
    this.saveToStorage();
    this.notifyChangeListeners();
    return true;
  }

  getFileContent(id: string): string | null {
    const file = this.findNode(id);
    if (!file || file.type !== "file") return null;
    return file.content || "";
  }

  rename(id: string, newName: string): boolean {
    const node = this.findNode(id);
    if (!node) return false;

    // Check if sibling with same name exists
    const siblings = node.parentId
      ? this.findNode(node.parentId)?.children || []
      : this.files;

    if (
      siblings.some((sibling) => sibling.id !== id && sibling.name === newName)
    ) {
      throw new Error("A file or folder with this name already exists");
    }

    node.name = newName;
    if (node.type === "file") {
      node.extension = newName.split(".").pop() || "";
    }
    node.updatedAt = new Date();
    this.saveToStorage();
    this.notifyChangeListeners();

    // Emit event to sync with other users in the room
    const roomId = socketManager.getRoomId();
    if (roomId) {
      console.log("Emitting file-renamed event for:", id, "new name:", newName);
      socketManager.connect().emit("file-renamed", {
        roomId,
        nodeId: id,
        newName,
      });
    }

    return true;
  }

  // Implement the "without emit" version for handling received events
  renameWithoutEmit(id: string, newName: string): boolean {
    const node = this.findNode(id);
    if (!node) return false;

    node.name = newName;
    if (node.type === "file") {
      node.extension = newName.split(".").pop() || "";
    }
    node.updatedAt = new Date();
    this.saveToStorage();
    this.notifyChangeListeners();
    return true;
  }

  delete(id: string): boolean {
    // Delete from root level
    const rootIndex = this.files.findIndex((node) => node.id === id);
    if (rootIndex !== -1) {
      this.files.splice(rootIndex, 1);
      this.saveToStorage();
      this.notifyChangeListeners();

      // Emit event to sync with other users in the room
      const roomId = socketManager.getRoomId();
      if (roomId) {
        socketManager.connect().emit("file-deleted", {
          roomId,
          nodeId: id,
        });
      }

      return true;
    }

    // Delete from nested folders
    const deleteFromChildren = (children: FileNode[], id: string): boolean => {
      const index = children.findIndex((node) => node.id === id);
      if (index !== -1) {
        children.splice(index, 1);
        return true;
      }
      return children.some(
        (node) => node.children && deleteFromChildren(node.children, id)
      );
    };

    const result = this.files.some(
      (node) => node.children && deleteFromChildren(node.children, id)
    );

    if (result) {
      this.saveToStorage();
      this.notifyChangeListeners();

      // Emit event to sync with other users in the room
      const roomId = socketManager.getRoomId();
      if (roomId) {
        socketManager.connect().emit("file-deleted", {
          roomId,
          nodeId: id,
        });
      }
    }

    return result;
  }

  // Version without emitting events
  deleteWithoutEmit(id: string): boolean {
    // Delete from root level
    const rootIndex = this.files.findIndex((node) => node.id === id);
    if (rootIndex !== -1) {
      this.files.splice(rootIndex, 1);
      this.saveToStorage();
      this.notifyChangeListeners();
      return true;
    }

    // Delete from nested folders
    const deleteFromChildren = (children: FileNode[], id: string): boolean => {
      const index = children.findIndex((node) => node.id === id);
      if (index !== -1) {
        children.splice(index, 1);
        return true;
      }
      return children.some(
        (node) => node.children && deleteFromChildren(node.children, id)
      );
    };

    const result = this.files.some(
      (node) => node.children && deleteFromChildren(node.children, id)
    );

    if (result) {
      this.saveToStorage();
      this.notifyChangeListeners();
    }

    return result;
  }

  move(nodeId: string, newParentId: string | null): boolean {
    const node = this.findNode(nodeId);
    if (!node) return false;

    // Get a copy of the node before removing it
    const nodeCopy = JSON.parse(JSON.stringify(node));

    // Remove from current location
    if (!this.delete(nodeId)) {
      return false;
    }

    if (newParentId) {
      const newParent = this.findNode(newParentId);
      if (!newParent || newParent.type !== "folder") return false;

      // Check for name conflicts in target folder
      if (newParent.children?.some((child) => child.name === node.name)) {
        // Restore the node to its original location
        this.restoreNode(nodeCopy);
        throw new Error(
          "An item with the same name already exists in the destination"
        );
      }

      newParent.children = newParent.children || [];
      newParent.children.push({
        ...node,
        parentId: newParentId,
      });
    } else {
      // Moving to root
      if (this.files.some((file) => file.name === node.name)) {
        // Restore the node to its original location
        this.restoreNode(nodeCopy);
        throw new Error("An item with the same name already exists in root");
      }

      this.files.push({
        ...node,
        parentId: undefined,
      });
    }

    this.saveToStorage();
    this.notifyChangeListeners();
    // Emit event at the end
    socketManager.fileMoved(nodeId, newParentId);
    return true;
  }

  // Version without emitting events
  moveWithoutEmit(nodeId: string, newParentId: string | null): boolean {
    // Same implementation but without socketManager.fileMoved() call
    const node = this.findNode(nodeId);
    if (!node) return false;

    // Get a copy of the node before removing it
    const nodeCopy = JSON.parse(JSON.stringify(node));

    // Remove from current location
    if (!this.delete(nodeId)) {
      return false;
    }

    if (newParentId) {
      const newParent = this.findNode(newParentId);
      if (!newParent || newParent.type !== "folder") return false;

      // Check for name conflicts in target folder
      if (newParent.children?.some((child) => child.name === node.name)) {
        // Restore the node to its original location
        this.restoreNode(nodeCopy);
        throw new Error(
          "An item with the same name already exists in the destination"
        );
      }

      newParent.children = newParent.children || [];
      newParent.children.push({
        ...node,
        parentId: newParentId,
      });
    } else {
      // Moving to root
      if (this.files.some((file) => file.name === node.name)) {
        // Restore the node to its original location
        this.restoreNode(nodeCopy);
        throw new Error("An item with the same name already exists in root");
      }

      this.files.push({
        ...node,
        parentId: undefined,
      });
    }

    this.saveToStorage();
    this.notifyChangeListeners();
    return true;
  }

  private restoreNode(node: FileNode) {
    if (node.parentId) {
      const parent = this.findNode(node.parentId);
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];
        parent.children.push(node);
      }
    } else {
      this.files.push(node);
    }
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.files));
    }
  }

  // New method to sync files from another user
  syncFiles(externalFiles: FileNode[]): void {
    // Replace current files with the received ones
    this.files = this.convertDates(externalFiles);
    this.saveToStorage();
  }

  // New methods to add existing files/folders from other users
  addExistingFile(file: FileNode, parentId: string | null): void {
    if (parentId) {
      const parent = this.findNode(parentId);
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];
        parent.children.push(file);
      }
    } else {
      this.files.push(file);
    }
    this.saveToStorage();
  }

  addExistingFolder(folder: FileNode, parentId: string | null): void {
    if (parentId) {
      const parent = this.findNode(parentId);
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];
        parent.children.push(folder);
      }
    } else {
      this.files.push(folder);
    }
    this.saveToStorage();
  }

  // Add methods for file synchronization

  // Get serializable file structure (for sending over socket)
  getSerializableFiles(): any[] {
    return JSON.parse(JSON.stringify(this.files));
  }

  // Import files from another user
  importFiles(externalFiles: any[]): void {
    if (!externalFiles || externalFiles.length === 0) return;

    // Replace current files with received ones
    this.files = this.convertDates(externalFiles);
    this.saveToStorage();
  }

  // Add a received file from another user
  addReceivedFile(file: FileNode, parentId: string | null): void {
    const newFile = {
      ...file,
      createdAt: new Date(file.createdAt),
      updatedAt: new Date(file.updatedAt),
    };

    if (parentId) {
      const parent = this.findNode(parentId);
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];

        // Remove any existing file with the same ID
        parent.children = parent.children.filter(
          (child) => child.id !== file.id
        );

        parent.children.push(newFile);
      }
    } else {
      // Remove any existing file with the same ID
      this.files = this.files.filter((f) => f.id !== file.id);
      this.files.push(newFile);
    }

    this.saveToStorage();
    this.notifyChangeListeners();

    // Emit event to sync with other users in the room
    const roomId = socketManager.getRoomId();
    if (roomId) {
      socketManager.connect().emit("file-created", {
        roomId,
        file: JSON.parse(JSON.stringify(newFile)), // Serialize to avoid issues
        parentId,
      });
    }
  }

  // Method to register a change listener
  onFileSystemChange(listener: () => void): () => void {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter((l) => l !== listener);
    };
  }

  // Method to notify listeners of changes
  private notifyChangeListeners(): void {
    this.changeListeners.forEach((listener) => listener());
  }
}

export const fileSystem = FileSystem.getInstance();
