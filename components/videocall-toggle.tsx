import { useEffect, useRef, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronUp, ChevronDown } from "lucide-react";

import { socketManager } from "@/lib/socket";

const VideoCallToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // create refs for the video elements
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(()=>{
    //assing the callback functions so the socketmanager can update the streams.
    socketManager.setLocalStreamCallback = setLocalStream;
    socketManager.setRemoteStreamCallback = setRemoteStream;
  })

  // update the local video on localstream changes
 useEffect(()=>{
   if(localStream && localVideoRef.current){
     localVideoRef.current.srcObject = localStream
   }
 },[localStream])
 useEffect(()=>{
   if(remoteStream && remoteVideoRef.current){
     remoteVideoRef.current.srcObject = remoteStream
   }
 },[remoteStream])

  return (
    <div className={`relative bg-transparent ${isOpen ? "h-full":"h-0"} flex flex-col bg-black text-white`}>
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        className="flex-grow h-full transition-all duration-500 ease-in-out"
      >
        <CollapsibleContent 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? "h-full opacity-100" : "h-0 opacity-0"
          }`}
        >
          <div className="p-4 border border-gray-600 rounded-lg bg-gray-800 text-white h-full flex items-center justify-center shadow-lg">
          <div id="videos">
            <div id="video-wrapper">
                <div id="waiting" className="btn btn-warning">Waiting for answer...</div>
                {localStream && <video ref={localVideoRef} className="video-player" autoPlay playsInline controls></video>}
            </div>
            {remoteStream && <video ref={remoteVideoRef} className="video-player" autoPlay playsInline controls></video>}
        </div>
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
