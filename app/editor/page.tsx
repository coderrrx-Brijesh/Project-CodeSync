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
import {
  Users,
  MessageSquare,
  Settings,
  Terminal,
  Play,
  Code2,
  Layers,
  LayoutPanelLeft,
  LayoutPanelRight,
  MonitorSmartphone,
} from "lucide-react";
import { Editor } from "@/components/editor";
import { Chat } from "@/components/chat";
import { Terminal as TerminalComponent } from "@/components/terminal";
import { FileExplorer } from "@/components/file-explorer";
import { CodeExecutor } from "@/lib/code-execution";
import { FileNode, fileSystem } from "@/lib/file-system";
import { CursorTracker } from "@/components/cursor-tracker";
import { socketManager } from "@/lib/socket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function EditorPage() {
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showFileExplorer, setShowFileExplorer] = useState(true);
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

  // active-users in room
  const [activeUsers, setActiveUsers] = useState(0);
  const socket = socketManager.connect();

  // Responsive states
  const isSmallScreen = useMediaQuery("(max-width: 768px)");
  const isMobileScreen = useMediaQuery("(max-width: 640px)");

  // Handle screen size changes
  useEffect(() => {
    if (isSmallScreen) {
      setShowChat(false);
      if (isMobileScreen) {
        setShowFileExplorer(false);
      }
    }
  }, [isSmallScreen, isMobileScreen]);

  socket.on("active-user-update", ({ activeUsers }) => {
    setActiveUsers(activeUsers);
  });

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

      // On mobile screens, automatically hide file explorer when a file is selected
      if (isMobileScreen) {
        setShowFileExplorer(false);
      }
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
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Add cursor tracker for collaborative editing */}
      <CursorTracker />

      {/* Header with tabs and controls */}
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <Code2 className="h-5 w-5 text-primary mr-2" />
              <h1 className="text-lg font-semibold">CodeSync</h1>
            </div>

            {/* Language selector */}
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="css">CSS</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
                <SelectItem value="plaintext">Plain Text</SelectItem>
              </SelectContent>
            </Select>

            {/* Run code button */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunCode}
              disabled={isExecuting || !activeFile}
              className="ml-2 h-8"
            >
              <Play className="h-3.5 w-3.5 mr-2" />
              Run
            </Button>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Active users */}
            <div className="flex items-center px-2 py-1 text-xs bg-primary/10 rounded-md mr-2">
              <Users className="h-3.5 w-3.5 mr-1.5 text-primary" />
              <span>{activeUsers} online</span>
            </div>

            {/* Layout controls for mobile/responsive */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:hidden"
                >
                  <Layers className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setShowFileExplorer(!showFileExplorer)}
                >
                  <LayoutPanelLeft className="h-4 w-4 mr-2" />
                  {showFileExplorer ? "Hide" : "Show"} Files
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowChat(!showChat)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {showChat ? "Hide" : "Show"} Chat
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowTerminal(!showTerminal)}
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  {showTerminal ? "Hide" : "Show"} Terminal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Desktop panels toggle buttons */}
            <div className="hidden md:flex items-center space-x-1">
              <Button
                variant={showFileExplorer ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowFileExplorer(!showFileExplorer)}
                title={showFileExplorer ? "Hide Files" : "Show Files"}
              >
                <LayoutPanelLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={showTerminal ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowTerminal(!showTerminal)}
                title={showTerminal ? "Hide Terminal" : "Show Terminal"}
              >
                <Terminal className="h-4 w-4" />
              </Button>
              <Button
                variant={showChat ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowChat(!showChat)}
                title={showChat ? "Hide Chat" : "Show Chat"}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="vertical" className="flex-1">
        <ResizablePanel defaultSize={70} minSize={30}>
          <ResizablePanelGroup direction="horizontal">
            {showFileExplorer && (
              <>
                <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                  <FileExplorer
                    onFileSelect={handleFileSelect}
                    selectedFileId={activeFile?.id}
                  />
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}
            <ResizablePanel defaultSize={60} minSize={30}>
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
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                    <Code2 className="h-12 w-12 mb-4 text-primary/30" />
                    <p className="text-lg">Select a file to start editing</p>
                    <p className="text-sm mt-2">
                      {!showFileExplorer && (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => setShowFileExplorer(true)}
                          className="px-0 h-auto"
                        >
                          Show file explorer
                        </Button>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </ResizablePanel>
            {showChat && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
                  <Chat />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </ResizablePanel>
        {showTerminal && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={15} maxSize={50}>
              <TerminalComponent />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
