import { Card } from "@/components/ui/card";
import { Video } from "lucide-react";
import { motion } from "framer-motion";
import { pulseVariants } from "@/lib/animation-types";

export default function FeatureVideoCalls() {
  return (
    <div className="flex flex-col md:flex-row items-center mb-24 relative">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="md:w-1/2 pr-8 md:text-right"
      >
        <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div variants={pulseVariants} animate="pulse" className="mb-6">
            <motion.div
              whileHover={{ y: [0, -5, 0], transition: { duration: 0.5 } }}
              className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ml-auto"
            >
              <Video className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-semibold mb-3 relative z-10">
            Integrated Video Calls
          </h3>
          <p className="text-muted-foreground relative z-10">
            Communicate with your team through seamless, built-in video
            conferencing. Discuss code changes without switching between
            different applications.
          </p>
        </Card>
      </motion.div>

      {/* Timeline Node */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-10 h-10 rounded-full bg-background border border-primary/50 flex items-center justify-center z-10"
        >
          <Video className="h-5 w-5 text-primary" />
        </motion.div>
      </div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
      >
        {/* Video Call Interactive Demo */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
          <div className="bg-black/50 py-2 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <div className="text-sm text-white/90">CodeSync Meeting</div>
            </div>
            <div className="text-xs text-white/70">23:14</div>
          </div>

          <div className="grid grid-cols-3 gap-2 p-3">
            {/* Main video */}
            <div className="col-span-3 aspect-video bg-black/70 rounded-md overflow-hidden relative border border-white/10">
              <motion.div
                animate={{
                  opacity: [0.7, 0.8, 0.7],
                  scale: [1, 1.01, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/5"
              />

              {/* Randomly generated particles to simulate video noise */}
              <div className="absolute inset-0 opacity-10">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    animate={{
                      opacity: [0, 1, 0],
                      x: Math.random() * 100 + "%",
                      y: Math.random() * 100 + "%",
                    }}
                    transition={{
                      duration: Math.random() * 2 + 1,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              <div className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded bg-black/50 text-white/80 border border-white/10 flex items-center gap-1.5">
                <Video className="h-3 w-3" />
                <span>Code Review Session</span>
              </div>
            </div>

            {/* Participant videos */}
            <div className="aspect-video bg-black/60 rounded-md overflow-hidden relative border border-white/10">
              <motion.div
                animate={{
                  opacity: [0.6, 0.7, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"
              />
              <div className="absolute bottom-1 left-1 text-[10px] px-1 rounded bg-black/50 text-white/80">
                Alex K.
              </div>
            </div>

            <div className="aspect-video bg-black/60 rounded-md overflow-hidden relative border border-white/10">
              <motion.div
                animate={{
                  opacity: [0.6, 0.7, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"
              />
              <div className="absolute bottom-1 left-1 text-[10px] px-1 rounded bg-black/50 text-white/80">
                Sarah J.
              </div>
            </div>

            <div className="aspect-video bg-black/60 rounded-md overflow-hidden relative border border-white/10">
              <motion.div
                animate={{
                  opacity: [0.6, 0.7, 0.6],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/30 text-[10px] text-yellow-300">
                  Joining...
                </div>
              </motion.div>
              <div className="absolute bottom-1 left-1 text-[10px] px-1 rounded bg-black/50 text-white/80">
                Marcus P.
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-2 py-3 border-t border-white/10 bg-black/30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center backdrop-blur-sm border border-white/10"
            >
              <Video className="h-4 w-4 text-primary" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center backdrop-blur-sm border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
                <polyline points="16 3 21 3 21 8" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-background/30 flex items-center justify-center backdrop-blur-sm border border-white/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center backdrop-blur-sm border border-red-500/30"
            >
              <Video className="h-4 w-4 text-white" />
            </motion.button>
          </div>

          {/* Screen Share Indicator */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="absolute top-12 right-3 bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-xs border border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Screen sharing active</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
