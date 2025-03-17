import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";

const VideoCallToggle = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative bg-transparent flex flex-col text-white ${
        isOpen ? "h-[100%]" : "h-[10%]"
      }`}>
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        className={`flex-grow h-full bg-transparent transition-all duration-500 ease-in-out`}
      >
        <CollapsibleContent 
          className={`overflow-hidden bg-transparent transition-all duration-500 ease-in-out h-full`}
        >
          <div className="p-4 border border-gray-600 rounded-lg bg-gray-800 text-white h-full flex items-center justify-center shadow-lg">
            Your Video Call Content
          </div>
        </CollapsibleContent>
        <CollapsibleTrigger 
            className="absolute bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full flex items-center justify-center shadow-md hover:bg-gray-700 transition-all duration-300 border border-gray-600"
        >
            {isOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  );
};

export default VideoCallToggle;
