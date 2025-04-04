"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import {
  CornerDownLeft,
  Bot,
  X,
  ThumbsUp,
  ThumbsDown,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBotProps {
  onClose: () => void;
}

export function ChatBot({ onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your coding assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate response delay (replace with actual API call)
    setTimeout(() => {
      // Sample responses (in a real app, this would be from an API)
      const responses = [
        "I can help you with that! Would you like to see some code examples?",
        "That's a great question about programming. Here's what I know...",
        "You might want to consider using a different approach. Let me explain...",
        "Here's a code snippet that might help:\n```javascript\nfunction example() {\n  console.log('Hello world');\n}\n```",
        "Have you tried debugging your code? Sometimes the simplest errors are the hardest to spot.",
      ];

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Function to format code blocks with syntax highlighting
  const formatMessage = (content: string) => {
    if (!content.includes("```")) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }

    const parts = content.split(/(```\w*\n[\s\S]*?\n```)/g);

    return parts.map((part, i) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        const code = part.replace(/```\w*\n/, "").replace(/\n```$/, "");
        return (
          <div key={i} className="relative my-2 bg-muted rounded-md">
            <pre className="p-3 text-sm overflow-x-auto">{code}</pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 opacity-70 hover:opacity-100"
              onClick={() => copyToClipboard(code, `code-${i}`)}
            >
              {copied === `code-${i}` ? (
                <CheckIcon className="h-3.5 w-3.5" />
              ) : (
                <CopyIcon className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        );
      }
      return (
        <p key={i} className="whitespace-pre-wrap">
          {part}
        </p>
      );
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-3 flex items-center justify-between bg-card/50">
        <div className="flex items-center">
          <Avatar className="h-7 w-7 mr-2 bg-primary/10">
            <AvatarFallback className="text-primary text-xs">
              <Bot className="h-3.5 w-3.5" />
            </AvatarFallback>
          </Avatar>
          <h2 className="font-medium text-sm">AI Assistant</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <Avatar
                className={cn(
                  "h-7 w-7 mt-0.5",
                  msg.role === "user" ? "bg-blue-600" : "bg-primary/10"
                )}
              >
                <AvatarFallback
                  className={cn(
                    "text-xs",
                    msg.role === "user" ? "text-white" : "text-primary"
                  )}
                >
                  {msg.role === "user" ? (
                    "YOU"
                  ) : (
                    <Bot className="h-3.5 w-3.5" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  "rounded-lg p-3 text-sm max-w-[85%]",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {formatMessage(msg.content)}

                {msg.role === "assistant" && (
                  <div className="flex items-center justify-end mt-2 space-x-1 opacity-70">
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <ThumbsDown className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                    >
                      {copied === msg.id ? (
                        <CheckIcon className="h-3 w-3" />
                      ) : (
                        <CopyIcon className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="h-7 w-7 mt-0.5 bg-primary/10">
                <AvatarFallback className="text-primary text-xs">
                  <Bot className="h-3.5 w-3.5" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3 text-sm flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div
                    className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-1.5 w-1.5 bg-primary/40 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">
                  AI is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about coding..."
            className="flex-1 h-9 text-sm"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9"
            disabled={isLoading || !input.trim()}
          >
            <CornerDownLeft className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
