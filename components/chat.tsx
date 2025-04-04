"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
} from "lucide-react";
import VideoCallToggle from "./video-call-toggle";
import ChatBotToggle from "./chat-bot-toggle";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface Message {
  id: string;
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
  const processedMessageIds = useRef(new Set<string>());

  useEffect(() => {
    const socket = socketManager.connect();

    socket.on("new-message", ({ chat }) => {
      if (!processedMessageIds.current.has(chat.id)) {
        processedMessageIds.current.add(chat.id);
        setMessages((prev) => [...prev, chat]);
      }
    });

    socket.on("user-connected", (userId: string) => {
      toast.success(`User ${userId} joined the room`);
    });

    return () => {
      socketManager.leaveRoom();
      processedMessageIds.current.clear();
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

    socketManager.sendMessage(inputMessage);
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

  return (
    <div className="h-full flex flex-col border-l border-border">
      <div className="border-b p-3 flex justify-between items-center bg-card/50">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="font-medium text-sm">Team Chat</h2>
        </div>
        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowChatBot(!showChatBot)}
                >
                  <Bot
                    className={cn("h-4 w-4", showChatBot && "text-primary")}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showChatBot ? "Hide" : "Show"} AI Assistant</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
            </div>
          )}
        </div>
      </div>

      {showChatBot ? (
        <div className="flex-1">
          <ChatBotToggle />
        </div>
      ) : (
        <>
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
                    key={key}
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
        </>
      )}

      <VideoCallToggle />
    </div>
  );
}
