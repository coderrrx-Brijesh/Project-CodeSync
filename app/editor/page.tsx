"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, MessageSquare, Settings, Terminal, Play } from "lucide-react";
import { Editor } from "@/components/editor";
import { Chat } from "@/components/chat";
import { Terminal as TerminalComponent } from "@/components/terminal";
import { FileExplorer } from "@/components/file-explorer";
import { CodeExecutor } from "@/lib/code-execution";
import { FileNode, fileSystem } from "@/lib/file-system";
import { toast } from "sonner";
import { CursorTracker } from "@/components/cursor-tracker";
import { socketManager } from "@/lib/socket";

export default function EditorPage() {
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [username, setUsername] = useState(
    "User_" + Math.floor(Math.random() * 1000)
  );
  const [cursorColor, setCursorColor] = useState(() => {
    const colors = [
      "#FF5D8F",
      "#4CB9E7",
      "#FFB100",
      "#7A86B6",
      "#3CCF4E",
      "#FF6969",
      "#A460ED",
      "#3A8891",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });
  const [isClicking, setIsClicking] = useState(false);

  // Move this useRef to the component level, outside of any useEffect
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // When a file is selected, load its content
  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      setActiveFile(file);
      // Load the file content
      const content = fileSystem.getFileContent(file.id) || "";
      setFileContent(content);

      // Set the language based on file extension
      const extension = file.name.split(".").pop() || "";
      const languageMap: { [key: string]: string } = {
        js: "javascript",
        ts: "typescript",
        py: "python",
        java: "java",
        cpp: "cpp",
        md: "markdown",
        html: "html",
        css: "css",
        json: "json",
      };
      setSelectedLanguage(languageMap[extension] || "plaintext");
    }
  };

  // When code changes in the editor, update the file content
  const handleCodeChange = (code: string) => {
    setFileContent(code);
    if (activeFile) {
      fileSystem.updateFile(activeFile.id, code);
    }
  };

  const handleRunCode = async () => {
    if (isExecuting || !activeFile?.content) return;

    if (!showTerminal) {
      setShowTerminal(true);
    }

    setIsExecuting(true);
    window.dispatchEvent(
      new CustomEvent("terminal-output", {
        detail: {
          type: "command",
          content: `$ Running ${selectedLanguage} code...`,
        },
      })
    );

    try {
      const result = await CodeExecutor.executeCode(
        fileContent,
        selectedLanguage
      );
      window.dispatchEvent(
        new CustomEvent("terminal-output", {
          detail: {
            type: result.success ? "output" : "error",
            content: result.output,
          },
        })
      );
    } catch (error) {
      window.dispatchEvent(
        new CustomEvent("terminal-output", {
          detail: {
            type: "error",
            content: String(error),
          },
        })
      );
    } finally {
      setIsExecuting(false);
    }
  };

  // Then in your useEffect:
  useEffect(() => {
    let lastEmitTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Update last position
      lastMousePosition.current = { x: e.clientX, y: e.clientY };

      // Throttle to avoid excessive network traffic
      if (now - lastEmitTime > 50) {
        lastEmitTime = now;
        socketManager.cursorMoved(
          e.clientX,
          e.clientY,
          username,
          cursorColor,
          isClicking
        );
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      socketManager.cursorMoved(
        lastMousePosition.current.x,
        lastMousePosition.current.y,
        username,
        cursorColor,
        true
      );
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      socketManager.cursorMoved(
        lastMousePosition.current.x,
        lastMousePosition.current.y,
        username,
        cursorColor,
        false
      );
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [username, cursorColor, isClicking]);

  return (
    <div className="h-screen flex flex-col">
      {/* Add this line to show other users' cursors */}
      <CursorTracker />

      {/* Header */}
      <header className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">CodeSync Editor</h1>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>3 online</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleRunCode}
            disabled={isExecuting || !activeFile}
          >
            <Play className="h-4 w-4" />{" "}
            {isExecuting ? "Running..." : "Run Code"}
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowTerminal(!showTerminal)}
            >
              <Terminal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={20} minSize={15}>
              <FileExplorer
                onFileSelect={handleFileSelect}
                selectedFileId={activeFile?.id}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60}>
              <div className="h-full w-full flex flex-col">
                {activeFile ? (
                  <div key={activeFile.id} className="flex-1 h-full w-full">
                    <Editor
                      language={selectedLanguage}
                      initialContent={fileContent}
                      onCodeChange={handleCodeChange}
                      fileId={activeFile.id}
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    Select a file to start editing
                  </div>
                )}
              </div>
            </ResizablePanel>
            {showChat && (
              <>
                <ResizableHandle />
                <ResizablePanel defaultSize={20}>
                  <Chat />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
        {showTerminal && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={30}>
              <TerminalComponent />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
