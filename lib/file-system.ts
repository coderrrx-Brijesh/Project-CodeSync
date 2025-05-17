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
  // Project metadata (optional, for folders/projects)
  description?: string;
  category?: string;
  isStarred?: boolean;
  collaborators?: number;
}

class FileSystem {
  private static instance: FileSystem;
  private files: FileNode[] = [];
  private initialized: boolean = false;
  private userId: string;
  private changeListeners: Array<() => void> = [];

  private constructor() {
    this.userId = socketManager.getUserId();
  }

  static getInstance(): FileSystem {
    if (!FileSystem.instance) {
      FileSystem.instance = new FileSystem();
    }
    return FileSystem.instance;
  }

  private getStorageKey(): string {
    return `fileSystem_${this.userId}`;
  }

  private initialize() {
    if (this.initialized) return;
    this.userId = socketManager.getUserId();
    try {
      const savedFiles = localStorage.getItem(this.getStorageKey());
      if (savedFiles) {
        const parsed = JSON.parse(savedFiles);
        this.files = this.convertDates(parsed);
      } else {
        // If no files exist, create a default structure
        this.createDefaultStructure();
      }
    } catch (error) {
      console.error("Error initializing FileSystem:", error);
      this.files = [];
    }
    this.initialized = true;
  }

  private convertDates(nodes: any[]): FileNode[] {
    return nodes.map((node) => ({
      ...node,
      createdAt: new Date(node.createdAt),
      updatedAt: new Date(node.updatedAt),
      children: node.children ? this.convertDates(node.children) : [],
    }));
  }

  private createDefaultStructure() {
    const rootFolder: FileNode = {
      id: uuidv4(),
      name: "My Project",
      type: "folder",
      children: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mainJsFile: FileNode = {
      id: uuidv4(),
      name: "main.js",
      type: "file",
      content: "// Your code here\nconsole.log('Hello, world!');",
      extension: "js",
      parentId: rootFolder.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    rootFolder.children!.push(mainJsFile);
    this.files = [rootFolder];
    this.saveToStorage();
    this.notifyChangeListeners();
  }

  // ------------------ Public API ------------------
  getFiles(): FileNode[] {
    if (typeof window !== "undefined" && !this.initialized) {
      this.initialize();
    }
    return this.files;
  }

  // NEW: Get file content by id
  getFileContent(id: string): string | null {
    const file = this.findNode(id);
    return file && file.type === "file" ? file.content || "" : null;
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
      if (!parent || parent.type !== "folder") {
        throw new Error("Parent folder not found");
      }
      if (parent.children?.some((child) => child.name === name)) {
        throw new Error("File already exists in this folder");
      }
      parent.children = parent.children || [];
      parent.children.push(newFile);
      newFile.parentId = parentId;
    } else {
      if (this.files.some((node) => node.name === name)) {
        throw new Error("File already exists in root");
      }
      this.files.push(newFile);
    }

    this.saveToStorage();
    this.notifyChangeListeners();

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
      if (!parent || parent.type !== "folder") {
        throw new Error("Parent folder not found");
      }
      if (parent.children?.some((child) => child.name === name)) {
        throw new Error("Folder already exists in this folder");
      }
      parent.children?.push(newFolder);
      newFolder.parentId = parentId;
    } else {
      if (this.files.some((node) => node.name === name)) {
        throw new Error("Folder already exists in root");
      }
      this.files.push(newFolder);
    }

    this.saveToStorage();
    this.notifyChangeListeners();

    const roomId = socketManager.getRoomId();
    if (roomId) {
      socketManager.connect().emit("folder-created", {
        roomId,
        folder: JSON.parse(JSON.stringify(newFolder)),
        parentId,
      });
    }

    return newFolder;
  }

  updateFile(id: string, content: string): boolean {
    const file = this.findNode(id);
    if (!file || file.type !== "file") return false;
    file.content = content;
    file.updatedAt = new Date();
    this.saveToStorage();
    this.debouncedEmitContentChange(id, content);
    return true;
  }

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

  updateFileWithoutEmit(id: string, content: string): boolean {
    const file = this.findNode(id);
    if (!file || file.type !== "file") return false;
    file.content = content;
    file.updatedAt = new Date();
    this.saveToStorage();
    this.notifyChangeListeners();
    return true;
  }

  rename(id: string, newName: string): boolean {
    const node = this.findNode(id);
    if (!node) return false;
    const siblings = node.parentId
      ? this.findNode(node.parentId)?.children || []
      : this.files;
    if (siblings.some((s) => s.id !== id && s.name === newName)) {
      throw new Error("A file or folder with this name already exists");
    }
    node.name = newName;
    if (node.type === "file") {
      node.extension = newName.split(".").pop() || "";
    }
    node.updatedAt = new Date();
    this.saveToStorage();
    this.notifyChangeListeners();
    const roomId = socketManager.getRoomId();
    if (roomId) {
      socketManager.connect().emit("file-renamed", {
        roomId,
        nodeId: id,
        newName,
      });
    }
    return true;
  }

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
    const rootIndex = this.files.findIndex((node) => node.id === id);
    if (rootIndex !== -1) {
      this.files.splice(rootIndex, 1);
      this.saveToStorage();
      this.notifyChangeListeners();
      const roomId = socketManager.getRoomId();
      if (roomId) {
        socketManager.connect().emit("file-deleted", { roomId, nodeId: id });
      }
      return true;
    }
    const deleteFromChildren = (
      children: FileNode[],
      nodeId: string
    ): boolean => {
      const idx = children.findIndex((node) => node.id === nodeId);
      if (idx !== -1) {
        children.splice(idx, 1);
        return true;
      }
      return children.some(
        (child) => child.children && deleteFromChildren(child.children, nodeId)
      );
    };
    const result = this.files.some(
      (node) => node.children && deleteFromChildren(node.children, id)
    );
    if (result) {
      this.saveToStorage();
      this.notifyChangeListeners();
      const roomId = socketManager.getRoomId();
      if (roomId) {
        socketManager.connect().emit("file-deleted", { roomId, nodeId: id });
      }
    }
    return result;
  }

  deleteWithoutEmit(id: string): boolean {
    const rootIndex = this.files.findIndex((node) => node.id === id);
    if (rootIndex !== -1) {
      this.files.splice(rootIndex, 1);
      this.saveToStorage();
      this.notifyChangeListeners();
      return true;
    }
    const deleteFromChildren = (
      children: FileNode[],
      nodeId: string
    ): boolean => {
      const idx = children.findIndex((node) => node.id === nodeId);
      if (idx !== -1) {
        children.splice(idx, 1);
        return true;
      }
      return children.some(
        (child) => child.children && deleteFromChildren(child.children, nodeId)
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
    const nodeCopy = JSON.parse(JSON.stringify(node));
    if (!this.delete(nodeId)) {
      return false;
    }
    if (newParentId) {
      const newParent = this.findNode(newParentId);
      if (!newParent || newParent.type !== "folder") return false;
      if (newParent.children?.some((child) => child.name === node.name)) {
        this.restoreNode(nodeCopy);
        throw new Error("An item with the same name already exists here");
      }
      newParent.children = newParent.children || [];
      newParent.children.push({ ...node, parentId: newParentId });
    } else {
      if (this.files.some((f) => f.name === node.name)) {
        this.restoreNode(nodeCopy);
        throw new Error("An item with the same name already exists in root");
      }
      this.files.push({ ...node, parentId: undefined });
    }
    this.saveToStorage();
    this.notifyChangeListeners();
    const roomId = socketManager.getRoomId();
    if (roomId) {
      socketManager.connect().emit("file-moved", {
        roomId,
        nodeId,
        newParentId,
      });
    }
    return true;
  }

  moveWithoutEmit(nodeId: string, newParentId: string | null): boolean {
    const node = this.findNode(nodeId);
    if (!node) return false;
    const nodeCopy = JSON.parse(JSON.stringify(node));
    if (!this.delete(nodeId)) {
      return false;
    }
    if (newParentId) {
      const newParent = this.findNode(newParentId);
      if (!newParent || newParent.type !== "folder") return false;
      if (newParent.children?.some((child) => child.name === node.name)) {
        this.restoreNode(nodeCopy);
        throw new Error("Name conflict in destination");
      }
      newParent.children = newParent.children || [];
      newParent.children.push({ ...node, parentId: newParentId });
    } else {
      if (this.files.some((f) => f.name === node.name)) {
        this.restoreNode(nodeCopy);
        throw new Error("Name conflict in root");
      }
      this.files.push({ ...node, parentId: undefined });
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
        const index = parent.children.findIndex((c) => c.id === node.id);
        if (index !== -1) {
          parent.children[index] = node;
        } else {
          parent.children.push(node);
        }
      }
    } else {
      const index = this.files.findIndex((f) => f.id === node.id);
      if (index !== -1) {
        this.files[index] = node;
      } else {
        this.files.push(node);
      }
    }
    this.saveToStorage();
  }

  // ------------------ Sync / Import ------------------
  syncFiles(externalFiles: FileNode[]): void {
    this.files = this.convertDates(externalFiles);
    this.saveToStorage();
    this.notifyChangeListeners();
  }

  addExistingFile(file: FileNode, parentId: string | null): void {
    if (parentId) {
      const parent = this.findNode(parentId);
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];
        const index = parent.children.findIndex((c) => c.id === file.id);
        if (index !== -1) {
          parent.children[index] = file;
        } else {
          parent.children.push(file);
        }
      }
    } else {
      const index = this.files.findIndex((f) => f.id === file.id);
      if (index !== -1) {
        this.files[index] = file;
      } else {
        this.files.push(file);
      }
    }
    this.saveToStorage();
    this.notifyChangeListeners();
  }

  addExistingFolder(folder: FileNode, parentId: string | null): void {
    if (parentId) {
      const parent = this.findNode(parentId);
      if (parent && parent.type === "folder") {
        parent.children = parent.children || [];
        const index = parent.children.findIndex((c) => c.id === folder.id);
        if (index !== -1) {
          parent.children[index] = folder;
        } else {
          parent.children.push(folder);
        }
      }
    } else {
      const index = this.files.findIndex((f) => f.id === folder.id);
      if (index !== -1) {
        this.files[index] = folder;
      } else {
        this.files.push(folder);
      }
    }
    this.saveToStorage();
    this.notifyChangeListeners();
  }

  importFiles(externalFiles: any[]): void {
    if (!externalFiles || externalFiles.length === 0) return;
    this.files = this.convertDates(externalFiles);
    this.saveToStorage();
    this.notifyChangeListeners();
  }

  // Add a received file from another user (no re-emit)
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
        const index = parent.children.findIndex((c) => c.id === newFile.id);
        if (index !== -1) {
          parent.children[index] = newFile;
        } else {
          parent.children.push(newFile);
        }
      }
    } else {
      const index = this.files.findIndex((f) => f.id === newFile.id);
      if (index !== -1) {
        this.files[index] = newFile;
      } else {
        this.files.push(newFile);
      }
    }
    this.saveToStorage();
    this.notifyChangeListeners();
  }

  // ------------------ Local Storage ------------------
  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.files));
    }
  }

  // ------------------ Change Listeners ------------------
  onFileSystemChange(listener: () => void): () => void {
    this.changeListeners.push(listener);
    return () => {
      this.changeListeners = this.changeListeners.filter((l) => l !== listener);
    };
  }

  // IMPORTANT: Force a new array reference so subscribers see a change
  private notifyChangeListeners(): void {
    this.files = [...this.files];
    this.changeListeners.forEach((listener) => listener());
  }

  // NEW: Get serializable file structure (for sending over socket)
  getSerializableFiles(): any[] {
    return JSON.parse(JSON.stringify(this.files));
  }
}

export const fileSystem = FileSystem.getInstance();
