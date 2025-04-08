"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";
import {
  Users,
  Plus,
  LogIn,
  Send,
  Copy,
  ClipboardCheck,
  MessageSquare,
  Bot,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import VideoCallToggle from "./video-call-toggle";
import { cn } from "@/lib/utils";
import { ChatBot } from "./chat-bot";

interface Message {
  id?: string; // Make ID optional since server doesn't send it
  userId: string;
  message: string;
  timestamp: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const processedMessages = useRef(new Set<string>());

  // Check for existing room in localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && !roomId) {
      const savedRoomId = localStorage.getItem("roomId");
      if (savedRoomId) {
        setRoomId(savedRoomId);
      }
    }
  }, []);

  // Handle socket connections and events
  useEffect(() => {
    const socket = socketManager.connect();

    // Use a robust approach to handle messages
    socket.on("new-message", (data) => {
      console.log("Raw message data:", data);

      if (!data.chat) return;

      // Create a unique message identifier based on content and timestamp
      const messageId =
        data.chat.userId + data.chat.timestamp + data.chat.message;

      // Only process each message once
      if (!processedMessages.current.has(messageId)) {
        processedMessages.current.add(messageId);

        // Create a chat object with the derived ID
        const chat = {
          ...data.chat,
          id: messageId,
        };

        // Set the message using functional update to ensure latest state
        setMessages((prevMessages) => [...prevMessages, chat]);
      }
    });

    socket.on("user-connected", (userId: string) => {
      toast.success(`User ${userId} joined the room`);
    });

    return () => {
      // Cleanup without affecting room connection
      socket.off("new-message");
      socket.off("user-connected");
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomId) return;

    // Send the message through the socket manager
    socketManager.sendMessage(inputMessage);

    // Don't add the message locally - we'll receive it back from the server
    // This prevents message duplication
    setInputMessage("");
  };

  const handleCreateRoom = () => {
    const newRoomId = socketManager.createRoom();
    setRoomId(newRoomId);
    toast.success(`Room created! ID: ${newRoomId}`);
  };

  const handleJoinRoom = () => {
    if (!joinRoomId.trim()) return;
    socketManager.joinRoom(joinRoomId);
    setRoomId(joinRoomId);
    setJoinRoomId("");
    toast.success(`Joined room: ${joinRoomId}`);
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      toast.success("Room ID copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Change the handleLeaveRoom function to also set a flag in sessionStorage
  const handleLeaveRoom = () => {
    // Store the fact that we explicitly left the room
    socketManager.leaveRoom();
    setRoomId(null);
    setMessages([]);
    toast.success("Left the room");
  };

  return (
    <div className="h-full flex flex-col border-l border-border">
      <div className="border-b p-3 flex justify-between items-center bg-card/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="font-medium text-sm">Team Chat</h2>
        </div>
        <div className="flex items-center space-x-2">
          {!roomId ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1.5 h-7 text-xs"
                  >
                    <LogIn className="h-3.5 w-3.5" /> Join Room
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join Room</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="roomId">Room ID</Label>
                      <Input
                        id="roomId"
                        value={joinRoomId}
                        onChange={(e) => setJoinRoomId(e.target.value)}
                        placeholder="Enter room ID"
                      />
                    </div>
                    <Button onClick={handleJoinRoom}>Join</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="default"
                size="sm"
                onClick={handleCreateRoom}
                className="flex items-center gap-1.5 h-7 text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Create Room
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-1">
              <div className="flex items-center bg-primary/10 pl-2 pr-1 py-1 rounded-md">
                <Users className="h-3.5 w-3.5 text-primary mr-1.5" />
                <span className="text-xs font-medium truncate max-w-[100px]">
                  {roomId}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 text-primary hover:text-primary hover:bg-primary/10"
                  onClick={copyRoomId}
                >
                  {copied ? (
                    <ClipboardCheck className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-300"
                onClick={handleLeaveRoom}
              >
                Leave
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center">
          <Bot className="h-4 w-4 mr-2 text-primary" />
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-accent"
            onClick={() => setShowChatBot(!showChatBot)}
          >
            {showChatBot ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {showChatBot ? (
        <ChatBot/>
      ) : (
        <div className="flex flex-col h-4/5">
          <ScrollArea className="flex-1 px-3 py-2">
            <div className="space-y-4">
              {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {roomId
                    ? "No messages yet. Start the conversation!"
                    : "Join or create a room to start chatting"}
                </p>
              </div>
            )}

            {messages.map((msg, key) => {
              const isFirstInGroup =
                key === 0 || messages[key - 1].userId !== msg.userId;

              return (
                <div
                  key={msg.id || `msg-${key}`}
                  className={cn(
                    "flex items-start gap-3",
                    !isFirstInGroup && "mt-1 pt-0"
                  )}
                >
                  {isFirstInGroup ? (
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {msg.userId.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-7"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    {isFirstInGroup && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">
                          User {msg.userId.slice(0, 4)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )}
                    <div className="rounded-md bg-muted py-2 px-3 text-sm break-words">
                      {msg.message}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      <div className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              roomId ? "Type your message..." : "Join a room to chat"
            }
            disabled={!roomId}
            className="h-9 text-sm"
          />
          <Button
            type="submit"
            disabled={!roomId}
            size="icon"
            className="h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
        </div>
      )}

      <VideoCallToggle />
    </div>
  );
}
