"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { FileNode, fileSystem } from "@/lib/file-system";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  MoveRight,
  Search,
  RefreshCw,
} from "lucide-react";
import { getIconForFile, getIconForFolder } from "vscode-icons-js";
import { cn } from "@/lib/utils";
import { FileDialog } from "./file-dialog";
import { toast } from "sonner";
import { socketManager } from "@/lib/socket";

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFileId?: string;
}

export function FileExplorer({
  onFileSelect,
  selectedFileId,
}: FileExplorerProps) {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"create" | "rename">("create");
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [draggedNode, setDraggedNode] = useState<FileNode | null>(null);
  const [dragOverNodeId, setDragOverNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const initialized = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  const refreshFiles = useCallback(() => {
    const allFiles = fileSystem.getFiles();
    setFiles(allFiles);

    if (selectedFileId) {
      const nodeExists = fileSystem.findNode(selectedFileId);
      if (!nodeExists && onFileSelect) {
        onFileSelect({
          id: "",
          name: "",
          type: "file",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }, [selectedFileId, onFileSelect]);

  useEffect(() => {
    if (!initialized.current) {
      refreshFiles();
      initialized.current = true;
    }
  }, [refreshFiles]);

  useEffect(() => {
    const socket = socketManager.connect();

    const handleFileChanged = () => {
      console.log("File system changed by another user, refreshing UI");
      refreshFiles();
    };

    socket.on("file-created", handleFileChanged);
    socket.on("file-updated", handleFileChanged);
    socket.on("file-deleted", handleFileChanged);
    socket.on("file-renamed", handleFileChanged);
    socket.on("file-moved", handleFileChanged);
    socket.on("share-files", handleFileChanged);

    return () => {
      socket.off("file-created", handleFileChanged);
      socket.off("file-updated", handleFileChanged);
      socket.off("file-deleted", handleFileChanged);
      socket.off("file-renamed", handleFileChanged);
      socket.off("file-moved", handleFileChanged);
      socket.off("share-files", handleFileChanged);
    };
  }, [refreshFiles]);

  useEffect(() => {
    const unsubscribe = fileSystem.onFileSystemChange(() => {
      console.log("File system changed, refreshing UI");
      refreshFiles();
    });

    return () => {
      unsubscribe();
    };
  }, [refreshFiles]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const toggleFolder = (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateItem = (name: string, type: "file" | "folder") => {
    try {
      const parentId = selectedNode?.type === "folder" ? selectedNode.id : null;

      const newNode =
        type === "file"
          ? fileSystem.createFile(parentId, name)
          : fileSystem.createFolder(parentId, name);

      if (newNode) {
        refreshFiles();
        if (parentId) {
          setExpandedFolders(
            new Set(Array.from(expandedFolders).concat(parentId))
          );
        }
        toast.success(`${type} created successfully`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create item"
      );
    }
  };

  const handleRename = (newName: string) => {
    if (!selectedNode) return;
    try {
      if (fileSystem.rename(selectedNode.id, newName)) {
        refreshFiles();
        toast.success("Renamed successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to rename");
    }
  };

  const handleDelete = (node: FileNode) => {
    try {
      if (fileSystem.delete(node.id)) {
        refreshFiles();

        if (node.type === "folder") {
          const newExpanded = new Set(expandedFolders);
          newExpanded.delete(node.id);
          setExpandedFolders(newExpanded);
        }

        if (selectedFileId === node.id) {
          onFileSelect({
            id: "",
            name: "",
            type: "file",
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }

        toast.success(`${node.type} deleted successfully`);
      }
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleDragStart = (node: FileNode, event: React.DragEvent) => {
    event.stopPropagation();
    setDraggedNode(node);
    event.dataTransfer.setData("text/plain", node.id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (node: FileNode, event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (node.type === "folder" && draggedNode?.id !== node.id) {
      setDragOverNodeId(node.id);
    }
  };

  const handleDrop = (targetNode: FileNode, event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setDragOverNodeId(null);

    if (!draggedNode || targetNode.type !== "folder") return;

    try {
      if (fileSystem.move(draggedNode.id, targetNode.id)) {
        refreshFiles();
        setExpandedFolders(
          new Set(Array.from(expandedFolders).concat(targetNode.id))
        );
        toast.success("Item moved successfully");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to move item"
      );
    }
  };

  // Get file icon based on file extension
  const getFileIcon = (fileName: string) => {
    const iconUrl = getIconForFile(fileName);
    return `https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/${iconUrl}`;
  };

  // Get folder icon based on folder state
  const getFolderIcon = (folderName: string, isExpanded: boolean) => {
    const iconName = isExpanded ? "folder-open" : "folder";
    const iconUrl = getIconForFolder(folderName);
    return `https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons/icons/${iconUrl}`;
  };

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) {
      return files;
    }

    const filterNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.reduce((acc, node) => {
        if (node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          acc.push(node);
        } else if (node.children && node.children.length) {
          const filteredChildren = filterNodes(node.children);
          if (filteredChildren.length) {
            acc.push({
              ...node,
              children: filteredChildren,
            });
          }
        }
        return acc;
      }, [] as FileNode[]);
    };

    return filterNodes(files);
  }, [files, searchQuery]);

  const renderNode = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = selectedFileId === node.id;
    const isDraggedOver = dragOverNodeId === node.id;

    return (
      <div key={node.id}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              className={cn(
                "flex items-center py-1.5 px-2 hover:bg-accent rounded-md cursor-pointer transition-colors duration-150",
                isSelected && "bg-accent/80 text-accent-foreground",
                isDraggedOver &&
                  "bg-accent/40 border border-dashed border-primary",
                level > 0 && `ml-${isMobile ? 2 : 4}`,
                isMobile && "py-2.5" // Bigger touch target on mobile
              )}
              onClick={() => node.type === "file" && onFileSelect(node)}
              draggable={true}
              onDragStart={(e) => handleDragStart(node, e)}
              onDragOver={(e) => handleDragOver(node, e)}
              onDragLeave={() => setDragOverNodeId(null)}
              onDrop={(e) => handleDrop(node, e)}
            >
              <div className="flex items-center flex-1">
                {node.type === "folder" && (
                  <button
                    onClick={(e) => toggleFolder(node.id, e)}
                    className={cn(
                      "mr-1 hover:bg-accent rounded-sm",
                      isMobile && "p-1" // Larger touch target for folder toggle
                    )}
                  >
                    {isExpanded ? (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          isMobile && "h-5 w-5"
                        )}
                      />
                    ) : (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          isMobile && "h-5 w-5"
                        )}
                      />
                    )}
                  </button>
                )}
                {node.type === "folder" ? (
                  <img
                    src={getFolderIcon(node.name, isExpanded)}
                    alt="folder"
                    className={cn("h-4 w-4 mr-2", isMobile && "h-5 w-5")}
                  />
                ) : (
                  <img
                    src={getFileIcon(node.name)}
                    alt="file"
                    className={cn("h-4 w-4 mr-2", isMobile && "h-5 w-5")}
                  />
                )}
                <span
                  className={cn("text-sm truncate", isMobile && "text-base")}
                >
                  {node.name}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={() => {
                setSelectedNode(node);
                setDialogType("rename");
                setDialogOpen(true);
              }}
              className={isMobile ? "py-2" : ""}
            >
              <Edit className={cn("h-4 w-4 mr-2", isMobile && "h-5 w-5")} />
              Rename
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => handleDelete(node)}
              className={cn("text-red-600", isMobile && "py-2")}
            >
              <Trash2 className={cn("h-4 w-4 mr-2", isMobile && "h-5 w-5")} />
              Delete
            </ContextMenuItem>
            {node.type === "folder" && (
              <ContextMenuItem
                onClick={() => {
                  setSelectedNode(node);
                  setDialogType("create");
                  setDialogOpen(true);
                }}
                className={isMobile ? "py-2" : ""}
              >
                <Plus className={cn("h-4 w-4 mr-2", isMobile && "h-5 w-5")} />
                New File/Folder
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
        {node.type === "folder" && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderedFiles = useMemo(() => {
    return filteredFiles.map((node) => renderNode(node));
  }, [filteredFiles, expandedFolders, selectedFileId, dragOverNodeId]);

  return (
    <div className="h-full flex flex-col bg-background/70 backdrop-blur-sm">
      <div
        className={cn("p-2 border-b flex flex-col gap-2", isMobile && "p-3")}
      >
        <div className="flex items-center gap-2">
          <h3 className={cn("text-sm font-medium", isMobile && "text-base")}>
            Files
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto h-6 w-6", isMobile && "h-8 w-8")}
            onClick={refreshFiles}
            title="Refresh"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isMobile && "h-4 w-4")} />
          </Button>
        </div>
        {isSearching ? (
          <div className="flex items-center gap-1">
            <Input
              className={cn("h-8 text-xs", isMobile && "h-10 text-sm")}
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isMobile && "h-10 w-10")}
              onClick={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
            >
              <ChevronRight className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-full h-8 flex items-center justify-between",
                isMobile && "h-10 text-sm"
              )}
              onClick={() => {
                setSelectedNode(null);
                setDialogType("create");
                setDialogOpen(true);
              }}
            >
              <span className={cn("text-xs", isMobile && "text-sm")}>
                New File/Folder
              </span>
              <Plus className={cn("h-3.5 w-3.5 ml-1", isMobile && "h-4 w-4")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8", isMobile && "h-10 w-10")}
              onClick={() => setIsSearching(true)}
            >
              <Search className={cn("h-4 w-4", isMobile && "h-5 w-5")} />
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className={cn("p-2", isMobile && "p-3")}>{renderedFiles}</div>
      </ScrollArea>
      <FileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={dialogType === "create" ? handleCreateItem : handleRename}
        type={dialogType}
        defaultValue={dialogType === "rename" ? selectedNode?.name : ""}
        defaultType={selectedNode?.type || "file"}
      />
    </div>
  );
}
