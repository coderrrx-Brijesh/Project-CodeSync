"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FileDialog } from "./file-dialog";
import { toast } from "sonner";

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
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const allFiles = fileSystem.getFiles();
      setFiles(allFiles[0]?.children || []);
      initialized.current = true;
    }
  }, []);

  const refreshFiles = () => {
    const allFiles = fileSystem.getFiles();
    setFiles(allFiles[0]?.children || []);
  };

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
      const parentId =
        selectedNode?.type === "folder" ? selectedNode.id : "root";
      const newNode =
        type === "file"
          ? fileSystem.createFile(parentId, name)
          : fileSystem.createFolder(parentId, name);

      if (newNode) {
        refreshFiles();
        if (parentId !== "root") {
          setExpandedFolders(new Set(Array.from(expandedFolders).concat(parentId)));
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
        const allFiles = fileSystem.getFiles();
        setFiles(allFiles[0]?.children || []);

        if (node.type === "folder") {
          const newExpanded = new Set(expandedFolders);
          newExpanded.delete(node.id);
          setExpandedFolders(newExpanded);
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
        setExpandedFolders(new Set(Array.from(expandedFolders).concat(targetNode.id)));
        toast.success("Item moved successfully");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to move item"
      );
    }
  };

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
                "flex items-center py-1 px-2 hover:bg-accent rounded-sm cursor-pointer",
                isSelected && "bg-accent",
                isDraggedOver &&
                  "bg-accent/50 border border-dashed border-primary",
                level > 0 && "ml-4"
              )}
              onClick={() => node.type === "file" && onFileSelect(node)}
              draggable={node.id !== "root"}
              onDragStart={(e) => handleDragStart(node, e)}
              onDragOver={(e) => handleDragOver(node, e)}
              onDragLeave={() => setDragOverNodeId(null)}
              onDrop={(e) => handleDrop(node, e)}
            >
              <div className="flex items-center flex-1">
                {node.type === "folder" && (
                  <button
                    onClick={(e) => toggleFolder(node.id, e)}
                    className="mr-1 hover:bg-accent rounded-sm"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                )}
                {node.type === "folder" ? (
                  <Folder className="h-4 w-4 mr-2 text-blue-500" />
                ) : (
                  <File className="h-4 w-4 mr-2 text-gray-500" />
                )}
                <span className="text-sm truncate">{node.name}</span>
              </div>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {node.id !== "root" && (
              <>
                <ContextMenuItem
                  onClick={() => {
                    setSelectedNode(node);
                    setDialogType("rename");
                    setDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => handleDelete(node)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </ContextMenuItem>
              </>
            )}
            {node.type === "folder" && (
              <ContextMenuItem
                onClick={() => {
                  setSelectedNode(node);
                  setDialogType("create");
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 border-b">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            setSelectedNode(null);
            setDialogType("create");
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          New File/Folder
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">{files.map((node) => renderNode(node))}</div>
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
