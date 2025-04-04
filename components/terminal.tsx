"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import {
  Terminal as TerminalIcon,
  X,
  ArrowUp,
  ArrowDown,
  SplitSquareVertical,
  Trash2,
  Check,
  InfoIcon,
  AlertCircle,
  ChevronsRight,
  Maximize2,
  Minimize2,
  Plus,
} from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

type OutputType = "command" | "output" | "error" | "info" | "success";

interface TerminalOutput {
  id: string;
  type: OutputType;
  content: string;
  timestamp: Date;
}

interface TerminalInstance {
  id: string;
  name: string;
  history: TerminalOutput[];
  commandHistory: string[];
  historyIndex: number;
  command: string;
}

export function Terminal() {
  const [terminalInstances, setTerminalInstances] = useState<
    TerminalInstance[]
  >([
    {
      id: "terminal-1",
      name: "Terminal 1",
      history: [
        {
          id: "welcome",
          type: "info",
          content:
            "Welcome to CodeSync Terminal. Type 'help' for available commands.",
          timestamp: new Date(),
        },
      ],
      commandHistory: [],
      historyIndex: -1,
      command: "",
    },
  ]);

  const [activeTerminalId, setActiveTerminalId] = useState("terminal-1");
  const [showClearButton, setShowClearButton] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [secondaryTerminalId, setSecondaryTerminalId] = useState<string | null>(
    null
  );

  const scrollAreaRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const bottomRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    // Scroll to bottom for each terminal when history changes
    terminalInstances.forEach((terminal) => {
      if (bottomRefs.current[terminal.id]) {
        bottomRefs.current[terminal.id]?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, [terminalInstances]);

  useEffect(() => {
    const handleTerminalOutput = (event: CustomEvent) => {
      const { type, content, terminalId } = event.detail;
      const targetTerminalId = terminalId || activeTerminalId;

      addOutput(targetTerminalId, content, type as OutputType);
    };

    window.addEventListener(
      "terminal-output",
      handleTerminalOutput as EventListener
    );

    return () => {
      window.removeEventListener(
        "terminal-output",
        handleTerminalOutput as EventListener
      );
    };
  }, [activeTerminalId]);

  const addOutput = (
    terminalId: string,
    content: string,
    type: OutputType = "output"
  ) => {
    setTerminalInstances((prevInstances) =>
      prevInstances.map((terminal) =>
        terminal.id === terminalId
          ? {
              ...terminal,
              history: [
                ...terminal.history,
                {
                  id: `output-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  type,
                  content,
                  timestamp: new Date(),
                },
              ],
            }
          : terminal
      )
    );
  };

  const handleCommand = (terminalId: string, e: React.FormEvent) => {
    e.preventDefault();

    const instance = terminalInstances.find((t) => t.id === terminalId);
    if (!instance || !instance.command.trim()) return;

    const command = instance.command;

    setTerminalInstances((prevInstances) =>
      prevInstances.map((terminal) =>
        terminal.id === terminalId
          ? {
              ...terminal,
              commandHistory: [
                command,
                ...terminal.commandHistory.slice(0, 19),
              ],
              historyIndex: -1,
              command: "",
              history: [
                ...terminal.history,
                {
                  id: `command-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  type: "command",
                  content: `$ ${command}`,
                  timestamp: new Date(),
                },
              ],
            }
          : terminal
      )
    );

    processCommand(terminalId, command);
  };

  const processCommand = (terminalId: string, cmd: string) => {
    const cmdLower = cmd.trim().toLowerCase();

    if (cmdLower === "clear" || cmdLower === "cls") {
      setTerminalInstances((prevInstances) =>
        prevInstances.map((terminal) =>
          terminal.id === terminalId
            ? {
                ...terminal,
                history: [
                  {
                    id: "clear",
                    type: "info",
                    content: "Terminal cleared.",
                    timestamp: new Date(),
                  },
                ],
              }
            : terminal
        )
      );
    } else if (cmdLower === "help") {
      addOutput(
        terminalId,
        "Available commands:\n" +
          "  clear, cls      - Clear the terminal\n" +
          "  help            - Show this help message\n" +
          "  time            - Show current time\n" +
          "  echo <text>     - Echo text to terminal\n" +
          "  split           - Split terminal view\n" +
          "  unsplit         - Return to single terminal view",
        "info"
      );
    } else if (cmdLower === "time") {
      addOutput(
        terminalId,
        `Current time: ${new Date().toLocaleString()}`,
        "success"
      );
    } else if (cmdLower.startsWith("echo ")) {
      const text = cmd.slice(5);
      addOutput(terminalId, text);
    } else if (cmdLower === "split" && !splitView) {
      createSplitTerminal();
    } else if (cmdLower === "unsplit" && splitView) {
      closeSplitTerminal();
    } else {
      addOutput(
        terminalId,
        `Command not found: ${cmd}. Type 'help' for available commands.`,
        "error"
      );
    }
  };

  const handleKeyDown = (
    terminalId: string,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const instance = terminalInstances.find((t) => t.id === terminalId);
    if (!instance) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (instance.commandHistory.length > 0) {
        const newIndex = Math.min(
          instance.historyIndex + 1,
          instance.commandHistory.length - 1
        );

        setTerminalInstances((prevInstances) =>
          prevInstances.map((terminal) =>
            terminal.id === terminalId
              ? {
                  ...terminal,
                  historyIndex: newIndex,
                  command: terminal.commandHistory[newIndex],
                }
              : terminal
          )
        );
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (instance.historyIndex > 0) {
        const newIndex = instance.historyIndex - 1;

        setTerminalInstances((prevInstances) =>
          prevInstances.map((terminal) =>
            terminal.id === terminalId
              ? {
                  ...terminal,
                  historyIndex: newIndex,
                  command: terminal.commandHistory[newIndex],
                }
              : terminal
          )
        );
      } else if (instance.historyIndex === 0) {
        setTerminalInstances((prevInstances) =>
          prevInstances.map((terminal) =>
            terminal.id === terminalId
              ? {
                  ...terminal,
                  historyIndex: -1,
                  command: "",
                }
              : terminal
          )
        );
      }
    }
  };

  const handleInputChange = (terminalId: string, value: string) => {
    setTerminalInstances((prevInstances) =>
      prevInstances.map((terminal) =>
        terminal.id === terminalId
          ? {
              ...terminal,
              command: value,
            }
          : terminal
      )
    );
  };

  const clearTerminal = (terminalId: string) => {
    setTerminalInstances((prevInstances) =>
      prevInstances.map((terminal) =>
        terminal.id === terminalId
          ? {
              ...terminal,
              history: [
                {
                  id: "clear",
                  type: "info",
                  content: "Terminal cleared.",
                  timestamp: new Date(),
                },
              ],
            }
          : terminal
      )
    );
  };

  const createSplitTerminal = () => {
    const newTerminalId = `terminal-${terminalInstances.length + 1}`;

    const newTerminal: TerminalInstance = {
      id: newTerminalId,
      name: `Terminal ${terminalInstances.length + 1}`,
      history: [
        {
          id: "welcome",
          type: "info",
          content: "New terminal session. Type 'help' for available commands.",
          timestamp: new Date(),
        },
      ],
      commandHistory: [],
      historyIndex: -1,
      command: "",
    };

    setTerminalInstances((prev) => [...prev, newTerminal]);
    setSecondaryTerminalId(newTerminalId);
    setSplitView(true);
  };

  const closeSplitTerminal = () => {
    setSplitView(false);
    setSecondaryTerminalId(null);
  };

  const createNewTerminal = () => {
    const newTerminalId = `terminal-${terminalInstances.length + 1}`;

    const newTerminal: TerminalInstance = {
      id: newTerminalId,
      name: `Terminal ${terminalInstances.length + 1}`,
      history: [
        {
          id: "welcome",
          type: "info",
          content: "New terminal session. Type 'help' for available commands.",
          timestamp: new Date(),
        },
      ],
      commandHistory: [],
      historyIndex: -1,
      command: "",
    };

    setTerminalInstances((prev) => [...prev, newTerminal]);
    setActiveTerminalId(newTerminalId);
  };

  const closeTerminal = (terminalId: string) => {
    // Don't allow closing the last terminal
    if (terminalInstances.length <= 1) return;

    // If closing the active terminal, switch to another one
    if (terminalId === activeTerminalId) {
      const index = terminalInstances.findIndex((t) => t.id === terminalId);
      const newActiveIndex = index === 0 ? 1 : index - 1;
      setActiveTerminalId(terminalInstances[newActiveIndex].id);
    }

    // If closing the secondary terminal in split view, exit split view
    if (terminalId === secondaryTerminalId) {
      setSplitView(false);
      setSecondaryTerminalId(null);
    }

    setTerminalInstances((prev) => prev.filter((t) => t.id !== terminalId));
  };

  const renderTerminal = (terminalId: string) => {
    const instance = terminalInstances.find((t) => t.id === terminalId);
    if (!instance) return null;

    return (
      <div className="h-full flex flex-col bg-[#0E1116] text-gray-100 font-mono text-sm">
        <div className="border-b border-gray-800 p-2 flex items-center justify-between bg-[#1A1D23]">
          <div className="flex items-center gap-2">
            <TerminalIcon className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-medium text-gray-300">
              {instance.name}
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={() => clearTerminal(terminalId)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">Clear terminal</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!splitView && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={createSplitTerminal}
                    >
                      <SplitSquareVertical className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Split terminal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {splitView && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={closeSplitTerminal}
                    >
                      {terminalId === activeTerminalId ? (
                        <Maximize2 className="h-3.5 w-3.5" />
                      ) : (
                        <Minimize2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">
                      {terminalId === activeTerminalId
                        ? "Maximize"
                        : "Minimize"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {terminalInstances.length > 1 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 text-gray-400 hover:text-white"
                      onClick={() => closeTerminal(terminalId)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Close terminal</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <ScrollArea
          className="flex-1 p-2"
          ref={(ref) => {
            scrollAreaRefs.current[terminalId] = ref;
          }}
        >
          <div className="space-y-1">
            {instance.history.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "py-0.5",
                  item.type === "command" && "text-blue-300",
                  item.type === "error" && "text-red-400",
                  item.type === "info" && "text-gray-400",
                  item.type === "success" && "text-emerald-400"
                )}
                style={{ whiteSpace: "pre-wrap" }}
              >
                {item.type === "command" && (
                  <span className="text-gray-500 mr-1">→</span>
                )}
                {item.type === "error" && (
                  <AlertCircle className="inline-block h-3 w-3 mr-1" />
                )}
                {item.type === "info" && (
                  <InfoIcon className="inline-block h-3 w-3 mr-1" />
                )}
                {item.type === "success" && (
                  <Check className="inline-block h-3 w-3 mr-1" />
                )}
                {item.content}
              </div>
            ))}
            <div
              ref={(ref) => {
                bottomRefs.current[terminalId] = ref;
              }}
              className="h-1"
            />
          </div>
        </ScrollArea>

        <form
          onSubmit={(e) => handleCommand(terminalId, e)}
          className="p-2 border-t border-gray-800 flex items-center bg-[#1A1D23]"
        >
          <ChevronsRight className="h-3.5 w-3.5 text-emerald-400 mr-2" />
          <Input
            ref={(ref) => {
              inputRefs.current[terminalId] = ref;
            }}
            value={instance.command}
            onChange={(e) => handleInputChange(terminalId, e.target.value)}
            onKeyDown={(e) => handleKeyDown(terminalId, e)}
            className="bg-transparent border-none text-gray-100 placeholder-gray-600 focus-visible:ring-0 flex-1 h-7 text-sm py-1 px-0"
            placeholder="Type your command..."
            autoComplete="off"
            spellCheck={false}
          />
          <div className="flex gap-1 ml-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-gray-500 hover:text-white"
              disabled={instance.commandHistory.length === 0}
              onClick={() => {
                if (instance.commandHistory.length > 0) {
                  const newIndex = Math.min(
                    instance.historyIndex + 1,
                    instance.commandHistory.length - 1
                  );
                  handleInputChange(
                    terminalId,
                    instance.commandHistory[newIndex]
                  );
                  setTerminalInstances((prev) =>
                    prev.map((t) =>
                      t.id === terminalId ? { ...t, historyIndex: newIndex } : t
                    )
                  );
                  inputRefs.current[terminalId]?.focus();
                }
              }}
              title="Previous command"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-gray-500 hover:text-white"
              disabled={instance.historyIndex <= 0}
              onClick={() => {
                if (instance.historyIndex > 0) {
                  const newIndex = instance.historyIndex - 1;
                  handleInputChange(
                    terminalId,
                    instance.commandHistory[newIndex]
                  );
                  setTerminalInstances((prev) =>
                    prev.map((t) =>
                      t.id === terminalId ? { ...t, historyIndex: newIndex } : t
                    )
                  );
                } else if (instance.historyIndex === 0) {
                  handleInputChange(terminalId, "");
                  setTerminalInstances((prev) =>
                    prev.map((t) =>
                      t.id === terminalId ? { ...t, historyIndex: -1 } : t
                    )
                  );
                }
                inputRefs.current[terminalId]?.focus();
              }}
              title="Next command"
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
          </div>
        </form>
      </div>
    );
  };

  // When not in split view, show tabs for terminal selection
  const renderSingleTerminal = () => {
    return (
      <div className="h-full flex flex-col">
        <Tabs
          value={activeTerminalId}
          onValueChange={setActiveTerminalId}
          className="h-full flex flex-col"
        >
          <div className="flex items-center border-b border-gray-800 bg-[#1A1D23]">
            <TabsList className="h-9 bg-transparent p-0 mx-2">
              {terminalInstances.map((terminal) => (
                <TabsTrigger
                  key={terminal.id}
                  value={terminal.id}
                  className="px-3 h-8 rounded-none data-[state=active]:bg-[#0E1116] border-t-2 border-t-transparent data-[state=active]:border-t-emerald-400 data-[state=active]:shadow-none"
                >
                  <span className="text-xs">{terminal.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="ml-auto mr-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-gray-400 hover:text-white"
                onClick={createNewTerminal}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 relative">
            {terminalInstances.map((terminal) => (
              <div
                key={terminal.id}
                className={cn(
                  "absolute inset-0",
                  terminal.id !== activeTerminalId && "hidden"
                )}
              >
                {renderTerminal(terminal.id)}
              </div>
            ))}
          </div>
        </Tabs>
      </div>
    );
  };

  // When in split view, show a split panel
  const renderSplitTerminals = () => {
    return (
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel defaultSize={50} minSize={30}>
          {renderTerminal(activeTerminalId)}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={30}>
          {secondaryTerminalId && renderTerminal(secondaryTerminalId)}
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  };

  return splitView ? renderSplitTerminals() : renderSingleTerminal();
}
