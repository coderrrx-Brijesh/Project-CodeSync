"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { socketManager } from '@/lib/socket';
import { toast } from 'sonner';
import { Users, Plus, LogIn } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = socketManager.connect();

    socket.on('new-message', ({chat}) => {
      setMessages(prev => [...prev, chat]);
    });

    socket.on("user-connected", (userId: string) => {
      toast.success(`User ${userId} joined the room`);
    })

    return () => {
      socketManager.leaveRoom();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !roomId) return;

    socketManager.sendMessage(inputMessage);
    setInputMessage('');
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
    setJoinRoomId('');
    toast.success(`Joined room: ${joinRoomId}`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-4 flex justify-between items-center">
        <h2 className="font-semibold">Team Chat</h2>
        <div className="flex items-center space-x-2">
          {!roomId ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Join Room
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
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Create Room
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">Room: {roomId}</span>
            </div>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg,key) => (
            <div key={key} className="flex items-start space-x-3">
              <Avatar>
                <AvatarFallback>
                  {msg.userId.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">User {msg.userId.slice(0, 4)}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-m">{msg.message}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={roomId ? "Type your message..." : "Join a room to chat"}
            disabled={!roomId}
          />
          <Button type="submit" disabled={!roomId}>Send</Button>
        </form>
      </div>
    </div>
  );
}