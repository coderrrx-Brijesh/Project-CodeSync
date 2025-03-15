"use client";

import { useEffect, useState } from "react";
import { socketManager } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";

type CursorPosition = {
  userId: string;
  x: number;
  y: number;
  username: string;
  color: string;
  clicking: boolean;
};

// Generate a random color from a pleasing palette
const generateColor = () => {
  const colors = [
    "#FF5D8F", // Pink
    "#4CB9E7", // Sky Blue
    "#FFB100", // Amber
    "#7A86B6", // Periwinkle
    "#3CCF4E", // Green
    "#FF6969", // Coral
    "#A460ED", // Purple
    "#3A8891", // Teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function CursorTracker() {
  const [cursors, setCursors] = useState<{ [userId: string]: CursorPosition }>(
    {}
  );
  const [myColor] = useState(generateColor());
  const socket = socketManager.connect();
  const currentUserId = socketManager.getUserId();

  useEffect(() => {
    // Listen for cursor position updates from other users
    const handleCursorUpdate = (data: CursorPosition) => {
      if (data.userId !== currentUserId) {
        setCursors((prev) => ({
          ...prev,
          [data.userId]: data,
        }));
      }
    };

    // Listen for when users leave the room
    const handleUserLeft = ({ userId }: { userId: string }) => {
      setCursors((prev) => {
        const newCursors = { ...prev };
        delete newCursors[userId];
        return newCursors;
      });
    };

    socket.on("cursor-moved", handleCursorUpdate);
    socket.on("user-left", handleUserLeft);

    return () => {
      socket.off("cursor-moved", handleCursorUpdate);
      socket.off("user-left", handleUserLeft);
    };
  }, [currentUserId, socket]);

  return (
    <>
      <AnimatePresence>
        {Object.values(cursors).map((cursor) => (
          <motion.div
            key={cursor.userId}
            className="absolute pointer-events-none z-50"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: 1,
              scale: cursor.clicking ? 0.8 : 1,
              x: cursor.x,
              y: cursor.y,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            style={{
              left: 0,
              top: 0,
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
              filter: cursor.clicking ? "brightness(1.3)" : "none",
            }}
          >
            <div className="flex flex-col items-center">
              {/* Custom cursor shape */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}
              >
                <path
                  d="M8.5,2.5 L21.5,15.5 L15.5,15.5 L12.5,21.5 L8.5,2.5 Z"
                  fill={cursor.color || "#3498db"}
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Username label with pill effect */}
              <div
                className="px-2 py-1 text-xs rounded-full mt-1 shadow-md whitespace-nowrap font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: `${cursor.color || "#3498db"}dd`,
                  color: "white",
                  transform: "translateY(-50%)",
                  textShadow: "0px 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                {cursor.username}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
