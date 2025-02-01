"use client"

import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';

interface TerminalOutput {
  id: number;
  type: 'command' | 'output' | 'error';
  content: string;
}

export function Terminal() {
  const [history, setHistory] = useState<TerminalOutput[]>([
    {
      id: 1,
      type: 'output',
      content: 'CodeSync Terminal v1.0.0'
    }
  ]);
  const [command, setCommand] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    const handleTerminalOutput = (event: CustomEvent<{ type: 'command' | 'output' | 'error', content: string }>) => {
      const { type, content } = event.detail;
      setHistory(prev => [
        ...prev,
        { id: Date.now(), type, content }
      ]);
    };

    window.addEventListener('terminal-output', handleTerminalOutput as EventListener);
    return () => {
      window.removeEventListener('terminal-output', handleTerminalOutput as EventListener);
    };
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    setHistory(prev => [
      ...prev,
      { id: Date.now(), type: 'command', content: `$ ${command}` },
      { id: Date.now() + 1, type: 'output', content: `Command '${command}' not recognized.` }
    ]);
    setCommand('');
  };

  return (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono text-sm">
      <div className="border-b border-gray-800 p-2">
        <h3 className="text-xs">TERMINAL</h3>
      </div>
      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-2"
      >
        <div className="space-y-1">
          {history.map((item) => (
            <div
              key={item.id}
              className={
                item.type === 'command'
                  ? 'text-white'
                  : item.type === 'error'
                    ? 'text-red-400'
                    : ''
              }
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {item.content}
            </div>
          ))}
          <div ref={bottomRef} className="h-1" />
        </div>
      </ScrollArea>
      <form onSubmit={handleCommand} className="p-2 border-t border-gray-800">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="bg-transparent border-none text-green-400 placeholder-gray-600 focus-visible:ring-0"
          placeholder="Type your command..."
        />
      </form>
    </div>
  );
}