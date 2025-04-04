import { useState, useEffect, useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  Video as VideoIcon,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  UserSquare2,
  Users,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import { socketManager } from "@/lib/socket";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface RemoteStream {
  userId: string;
  socketId: string;
  stream: MediaStream;
}

// Component to render remote video
const RemoteVideo = ({
  userId,
  stream,
}: {
  userId: string;
  stream: MediaStream;
}) => {
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
    // Check if mediaDevices API is supported before attempting to join
    if (
      typeof window !== "undefined" &&
      (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)
    ) {
      toast.error(
        "Your browser doesn't support video calls. Please use Chrome, Firefox, or Edge."
      );
      return;
    }

    try {
      const stream = await socketManager.joinVideoCall();
      if (stream) {
        localStream.current = stream;
        setIsInCall(true);
        if (!isOpen) {
          setIsOpen(true);
        }
      } else {
        // More detailed error from socketManager
        toast.error(
          "Unable to join video call. Please check your camera and microphone permissions."
        );
      }
    } catch (error) {
      console.error("Error joining call:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to join video call"
      );
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
    <div
      className={`relative bg-background flex flex-col text-foreground ${
        isOpen ? "h-[300px]" : "h-[40px]"
      }`}
    >
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="flex-grow h-full"
      >
        {/* When collapsed, show a nice header bar */}
        {!isOpen && (
          <div className="flex items-center justify-between p-2 border-t border-border">
            <div className="flex items-center">
              <UserSquare2 className="h-4 w-4 mr-2 text-primary" />
              <span className="text-sm font-medium">Video Call</span>
              {isInCall && (
                <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {!isInCall && (
                <Button
                  onClick={joinCall}
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                >
                  <Phone className="h-3.5 w-3.5" />
                </Button>
              )}
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

        <CollapsibleContent className={`overflow-hidden h-full`}>
          <div className="border border-border rounded-md bg-card shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center p-2 border-b border-border">
              <div className="flex items-center">
                <VideoIcon className="h-4 w-4 mr-2 text-primary" />
                <h3 className="text-sm font-medium">Video Call</h3>
                {isInCall && (
                  <div className="flex items-center ml-2">
                    <span className="ml-2 text-xs bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-1"></span>
                      Live
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                {isInCall && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleVideo}
                      className={`h-7 w-7 ${
                        !isVideoEnabled
                          ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                          : ""
                      }`}
                      title={
                        isVideoEnabled ? "Turn off camera" : "Turn on camera"
                      }
                    >
                      {isVideoEnabled ? (
                        <VideoIcon className="h-3.5 w-3.5" />
                      ) : (
                        <VideoOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleAudio}
                      className={`h-7 w-7 ${
                        !isAudioEnabled
                          ? "text-red-500 bg-red-500/10 hover:bg-red-500/20"
                          : ""
                      }`}
                      title={
                        isAudioEnabled ? "Mute microphone" : "Unmute microphone"
                      }
                    >
                      {isAudioEnabled ? (
                        <Mic className="h-3.5 w-3.5" />
                      ) : (
                        <MicOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={leaveCall}
                      className="h-7 w-7 text-red-500 hover:bg-red-500/10"
                      title="Leave call"
                    >
                      <PhoneOff className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
                {!isInCall && (
                  <Button
                    onClick={joinCall}
                    size="sm"
                    className="h-7 text-xs bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    Join Call
                  </Button>
                )}
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    title="Minimize"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </div>

            <div className="relative p-3 flex-grow grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
              {/* Local video */}
              {isInCall && (
                <div className="relative aspect-video bg-muted rounded-md overflow-hidden border border-border shadow-sm">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6 border-2 border-primary">
                          <AvatarFallback className="text-[10px] bg-primary">
                            YOU
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-white">You</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {!isVideoEnabled && (
                          <span className="text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                            <VideoOff className="h-2.5 w-2.5 inline mr-0.5" />
                            <span>Camera Off</span>
                          </span>
                        )}
                        {!isAudioEnabled && (
                          <span className="text-[10px] bg-black/50 text-white px-1.5 py-0.5 rounded-full">
                            <MicOff className="h-2.5 w-2.5 inline mr-0.5" />
                            <span>Muted</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Remote videos */}
              {remoteStreams.map((remoteStream) => (
                <div
                  key={remoteStream.userId}
                  className="relative aspect-video bg-muted rounded-md overflow-hidden border border-border shadow-sm"
                >
                  <RemoteVideo
                    userId={remoteStream.userId}
                    stream={remoteStream.stream}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 border-2 border-primary">
                        <AvatarFallback className="text-[10px] bg-primary">
                          {remoteStream.userId.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-white ml-2">
                        User {remoteStream.userId.slice(0, 4)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Placeholder for empty state */}
              {isInCall && remoteStreams.length === 0 && (
                <div className="flex flex-col items-center justify-center aspect-video bg-muted rounded-md border border-dashed border-border">
                  <Users className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Waiting for others to join...
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Share the room code for others to join
                  </p>
                </div>
              )}

              {/* Placeholder for not in call */}
              {!isInCall && (
                <div className="flex flex-col items-center justify-center aspect-video bg-muted rounded-md border border-dashed border-border col-span-full">
                  <VideoIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Join the call to start video chatting
                  </p>
                  <Button
                    onClick={joinCall}
                    size="sm"
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1.5" />
                    Join Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default VideoCallToggle;
