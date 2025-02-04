"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, MessageSquare, Settings, Terminal, Play } from "lucide-react";
import { Editor } from "@/components/editor";
import { Chat } from "@/components/chat";
import { Terminal as TerminalComponent } from "@/components/terminal";
import { FileExplorer } from "@/components/file-explorer";
import { CodeExecutor } from "@/lib/code-execution";
import { FileNode, fileSystem } from "@/lib/file-system";

export default function EditorPage() {
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [activeFile, setActiveFile] = useState<FileNode | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleFileSelect = (file: FileNode) => {
    if (file.type === 'file') {
      setActiveFile(file);
      const extension = file.name.split('.').pop() || '';
      const languageMap: { [key: string]: string } = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp'
      };
      setSelectedLanguage(languageMap[extension] || 'plaintext');
    }
  };

  const handleCodeChange = (code: string) => {
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
    window.dispatchEvent(new CustomEvent('terminal-output', { 
      detail: {
        type: 'command',
        content: `$ Running ${selectedLanguage} code...`
      }
    }));

    try {
      const result = await CodeExecutor.executeCode(activeFile.content, selectedLanguage);
      window.dispatchEvent(new CustomEvent('terminal-output', { 
        detail: {
          type: result.success ? 'output' : 'error',
          content: result.output
        }
      }));
    } catch (error) {
      window.dispatchEvent(new CustomEvent('terminal-output', { 
        detail: {
          type: 'error',
          content: String(error)
        }
      }));
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
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
            </SelectContent>
          </Select>
          <Button 
            variant="default" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleRunCode}
            disabled={isExecuting || !activeFile}
          >
            <Play className="h-4 w-4" /> {isExecuting ? 'Running...' : 'Run Code'}
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
              <div className="h-full">
                {activeFile ? (
                  <Editor
                    language={selectedLanguage}
                    onCodeChange={handleCodeChange}
                    key={activeFile.id}
                  />
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