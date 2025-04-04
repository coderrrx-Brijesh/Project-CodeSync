"use client";

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Input } from "./ui/input";
import {
  Terminal as TerminalIcon,
  XCircle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "./ui/button";

type OutputType = "command" | "output" | "error";

interface TerminalOutput {
  id: string;
  type: OutputType;
  content: string;
  timestamp: Date;
}

export function Terminal() {
  const [history, setHistory] = useState<TerminalOutput[]>([
    {
      id: "welcome",
      type: "output",
      content:
        "Welcome to CodeSync Terminal. Type 'help' for available commands.",
      timestamp: new Date(),
    },
  ]);
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showClearButton, setShowClearButton] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  useEffect(() => {
    const handleTerminalOutput = (event: CustomEvent) => {
      const { type, content } = event.detail;
      addOutput(content, type as OutputType);
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
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => setShowClearButton(true);
    const handleMouseLeave = () => setShowClearButton(false);

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener("mouseenter", handleMouseEnter);
      scrollArea.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener("mouseenter", handleMouseEnter);
        scrollArea.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const addOutput = (content: string, type: OutputType = "output") => {
    setHistory((prev) => [
      ...prev,
      {
        id: `output-${Date.now()}`,
        type,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) return;

    setCommandHistory((prev) => [command, ...prev.slice(0, 19)]);
    setHistoryIndex(-1);

    addOutput(`$ ${command}`, "command");

    processCommand(command);

    setCommand("");
  };

  const processCommand = (cmd: string) => {
    const cmdLower = cmd.trim().toLowerCase();

    if (cmdLower === "clear" || cmdLower === "cls") {
      setHistory([
        {
          id: "clear",
          type: "output",
          content: "Terminal cleared.",
          timestamp: new Date(),
        },
      ]);
    } else if (cmdLower === "help") {
      addOutput(
        "Available commands:\n" +
          "  clear, cls      - Clear the terminal\n" +
          "  help            - Show this help message\n" +
          "  time            - Show current time\n" +
          "  echo <text>     - Echo text to terminal"
      );
    } else if (cmdLower === "time") {
      addOutput(`Current time: ${new Date().toLocaleString()}`);
    } else if (cmdLower.startsWith("echo ")) {
      const text = cmd.slice(5);
      addOutput(text);
    } else {
      addOutput(
        `Command not found: ${cmd}. Type 'help' for available commands.`,
        "error"
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand("");
      }
    }
  };

  const clearTerminal = () => {
    setHistory([
      {
        id: "clear",
        type: "output",
        content: "Terminal cleared.",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm">
      <div className="border-b border-gray-800 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4" />
          <h3 className="text-xs font-medium">TERMINAL</h3>
        </div>
        <div>
          {showClearButton && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={clearTerminal}
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-2">
        <div className="space-y-1">
          {history.map((item) => (
            <div
              key={item.id}
              className={
                item.type === "command"
                  ? "text-white"
                  : item.type === "error"
                    ? "text-red-400"
                    : ""
              }
              style={{ whiteSpace: "pre-wrap" }}
            >
              {item.content}
            </div>
          ))}
          <div ref={bottomRef} className="h-1" />
        </div>
      </ScrollArea>
      <form
        onSubmit={handleCommand}
        className="p-2 border-t border-gray-800 flex"
      >
        <div className="text-white mr-2">$</div>
        <Input
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none text-green-400 placeholder-gray-600 focus-visible:ring-0 flex-1"
          placeholder="Type your command..."
          autoComplete="off"
          spellCheck={false}
        />
        <div className="flex gap-1 ml-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            disabled={commandHistory.length === 0}
            onClick={() => {
              if (commandHistory.length > 0) {
                const newIndex = Math.min(
                  historyIndex + 1,
                  commandHistory.length - 1
                );
                setHistoryIndex(newIndex);
                setCommand(commandHistory[newIndex]);
                inputRef.current?.focus();
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
            className="h-6 w-6"
            disabled={historyIndex <= 0}
            onClick={() => {
              if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setCommand(commandHistory[newIndex]);
              } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setCommand("");
              }
              inputRef.current?.focus();
            }}
            title="Next command"
          >
            <ArrowDown className="h-3 w-3" />
          </Button>
        </div>
      </form>
    </div>
  );
}
