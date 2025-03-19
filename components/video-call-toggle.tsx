import { useState, useEffect, useRef } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Video as VideoIcon, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";

interface RemoteStream {
  userId: string;
  socketId: string;
  stream: MediaStream;
}

// Component to render remote video
const RemoteVideo = ({ userId, stream }: { userId: string, stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-full object-cover"
    />
  );
};

const VideoCallToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [remoteStreams, setRemoteStreams] = useState<RemoteStream[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStream = useRef<MediaStream | null>(null);

  // Initialize event listeners when component mounts
  useEffect(() => {
    socketManager.setOnUserJoinedVideoCallback(handleUserJoined);
    socketManager.setOnUserLeftVideoCallback(handleUserLeft);
    socketManager.setOnRemoteStreamCallback(handleRemoteStream);

    return () => {
      // Clean up event listeners
      socketManager.setOnUserJoinedVideoCallback(() => {});
      socketManager.setOnUserLeftVideoCallback(() => {});
      socketManager.setOnRemoteStreamCallback(() => {});
    };
  }, []);

  // Handle when local stream changes (showing local video)
  useEffect(() => {
    if (localStream.current && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream.current;
    }
  }, [localStream.current]);

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      if (isInCall) {
        leaveCall();
      }
    };
  }, [isInCall]);

  const handleUserJoined = (userId: string, socketId: string) => {
    toast.info(`User ${userId.slice(0, 4)} joined the video call`);
  };

  const handleUserLeft = (userId: string, socketId: string) => {
    toast.info(`User ${userId.slice(0, 4)} left the video call`);
    setRemoteStreams((prevStreams) => 
      prevStreams.filter((stream) => stream.socketId !== socketId)
    );
  };

  const handleRemoteStream = (userId: string, stream: MediaStream) => {
    const socketId = Array.from(stream.getTracks())[0]?.id || userId;
    setRemoteStreams((prevStreams) => {
      // Check if we already have this stream
      const exists = prevStreams.some((s) => s.userId === userId);
      if (exists) {
        // Update the existing stream
        return prevStreams.map((s) => 
          s.userId === userId ? { ...s, stream } : s
        );
      } else {
        // Add the new stream
        return [...prevStreams, { userId, socketId, stream }];
      }
    });
  };

  const joinCall = async () => {
    try {
      const stream = await socketManager.joinVideoCall();
      if (stream) {
        localStream.current = stream;
        setIsInCall(true);
        if (!isOpen) {
          setIsOpen(true);
        }
      } else {
        toast.error("Failed to access camera and microphone");
      }
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error("Failed to join video call");
    }
  };

  const leaveCall = () => {
    socketManager.leaveVideoCall();
    localStream.current = null;
    setIsInCall(false);
    setRemoteStreams([]);
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTracks = localStream.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !isVideoEnabled;
      });
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTracks = localStream.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !isAudioEnabled;
      });
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

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
          <div className="p-4 border border-gray-600 rounded-lg bg-gray-800 text-white h-full flex flex-col shadow-lg">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">Video Call</h3>
              <div className="flex gap-2">
                {isInCall && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleVideo}
                      className={`${!isVideoEnabled ? 'bg-red-800 hover:bg-red-700' : ''}`}
                    >
                      {isVideoEnabled ? <VideoIcon size={16} /> : <VideoOff size={16} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleAudio}
                      className={`${!isAudioEnabled ? 'bg-red-800 hover:bg-red-700' : ''}`}
                    >
                      {isAudioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={leaveCall}
                    >
                      <PhoneOff size={16} />
                    </Button>
                  </>
                )}
                {!isInCall && (
                  <Button onClick={joinCall} variant="default" className="bg-green-600 hover:bg-green-500">
                    Join Call
                  </Button>
                )}
              </div>
            </div>
            
            <div className="relative flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
              {/* Local video */}
              {isInCall && (
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                    You {!isVideoEnabled && "(Video Off)"} {!isAudioEnabled && "(Muted)"}
                  </div>
                </div>
              )}
              
              {/* Remote videos */}
              {remoteStreams.map((remoteStream) => (
                <div key={remoteStream.userId} className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <RemoteVideo 
                    userId={remoteStream.userId}
                    stream={remoteStream.stream}
                  />
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                    User {remoteStream.userId.slice(0, 4)}
                  </div>
                </div>
              ))}
              
              {/* Placeholder for empty state */}
              {isInCall && remoteStreams.length === 0 && (
                <div className="flex items-center justify-center aspect-video bg-gray-900 rounded-lg">
                  <p className="text-gray-400 text-center">
                    Waiting for others to join the call...
                  </p>
                </div>
              )}
              
              {/* Placeholder for not in call */}
              {!isInCall && (
                <div className="flex items-center justify-center aspect-video bg-gray-900 rounded-lg col-span-full">
                  <p className="text-gray-400 text-center">
                    Join the call to start video chatting with others in this room.
                  </p>
                </div>
              )}
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
