"use client";

import { v4 as uuidv4 } from "uuid";

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

  private constructor() {
    this.files = [];
  }

  private initialize() {
    if (this.initialized) return;

    try {
      const savedFiles = localStorage.getItem("fileSystem");
      if (savedFiles) {
        const parsedFiles = JSON.parse(savedFiles);
        // Convert string dates back to Date objects
        this.files = this.convertDates(parsedFiles);
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
      }
    } else {
      // Check for duplicate names in root
      if (this.files.some((node) => node.name === name)) {
        throw new Error("File already exists in root");
      }
      this.files.push(newFile);
    }

    this.saveToStorage();
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
      }
    } else {
      // Check for duplicate names in root
      if (this.files.some((node) => node.name === name)) {
        throw new Error("Folder already exists in root");
      }
      this.files.push(newFolder);
    }

    this.saveToStorage();
    return newFolder;
  }

  updateFile(id: string, content: string): boolean {
    const file = this.findNode(id);
    if (!file || file.type !== "file") return false;
    file.content = content;
    file.updatedAt = new Date();
    this.saveToStorage();
    return true;
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
    return true;
  }

  delete(id: string): boolean {
    // Delete from root level
    const rootIndex = this.files.findIndex((node) => node.id === id);
    if (rootIndex !== -1) {
      this.files.splice(rootIndex, 1);
      this.saveToStorage();
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
    }
    return result;
  }

  move(nodeId: string, newParentId: string | null): boolean {
    const node = this.findNode(nodeId);
    if (!node) return false;

    // Remove from current location
    this.delete(nodeId);

    if (newParentId) {
      const newParent = this.findNode(newParentId);
      if (!newParent || newParent.type !== "folder") return false;

      // Check for name conflicts in target folder
      if (newParent.children?.some((child) => child.name === node.name)) {
        throw new Error(
          "An item with the same name already exists in the destination"
        );
      }

      newParent.children = newParent.children || [];
      newParent.children.push(node);
      node.parentId = newParentId;
    } else {
      // Moving to root
      if (this.files.some((file) => file.name === node.name)) {
        throw new Error("An item with the same name already exists in root");
      }
      delete node.parentId;
      this.files.push(node);
    }

    this.saveToStorage();
    return true;
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("fileSystem", JSON.stringify(this.files));
    }
  }
}

export const fileSystem = FileSystem.getInstance();
