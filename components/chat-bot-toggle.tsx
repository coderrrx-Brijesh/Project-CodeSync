"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Bot, ChevronDown, ChevronUp } from "lucide-react";
import { ChatBot } from "./chat-bot";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ChatBotToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative flex flex-col ${isOpen ? "h-full" : "h-[40px]"}`}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex-grow h-full"
      >
        {/* When collapsed, show a header bar */}
        {!isOpen && (
          <div className="flex items-center justify-between p-2 border-t border-border">
            <div className="flex items-center">
              <Bot className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <div className="flex items-center space-x-1">
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-accent"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
        )}

        <CollapsibleContent className="h-full">
          <ChatBot onClose={() => setIsOpen(false)} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ChatBotToggle;
