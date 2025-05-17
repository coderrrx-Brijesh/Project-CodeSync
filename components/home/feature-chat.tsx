import { Card } from "@/components/ui/card";
import { MessageSquare, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { pulseVariants } from "@/lib/animation-types";

export default function FeatureChat() {
  return (
    <div className="flex flex-col md:flex-row items-center relative">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="md:w-1/2 md:pr-8 mt-8 md:mt-0"
      >
        {/* Chat Integration Interactive Demo */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
          <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <div className="text-sm">Team Chat</div>
            </div>
            <div className="bg-primary/20 px-2 py-0.5 rounded-full text-xs">
              3 online
            </div>
          </div>

          <div className="flex flex-col h-[320px]">
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {/* Chat messages */}
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] border border-blue-500/30 mt-0.5">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-xs">Alex</div>
                    <div className="text-[10px] text-muted-foreground">
                      10:42 AM
                    </div>
                  </div>
                  <div className="mt-1 p-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs">
                    I just pushed the auth updates to the feature branch. Can
                    someone review?
                  </div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] border border-green-500/30 mt-0.5">
                  S
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-xs">Sarah</div>
                    <div className="text-[10px] text-muted-foreground">
                      10:45 AM
                    </div>
                  </div>
                  <div className="mt-1 p-2 rounded-md bg-green-500/10 border border-green-500/20 text-xs">
                    I'll take a look at it now. Did you add the JWT refresh
                    logic?
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] border border-blue-500/30 mt-0.5">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-xs">Alex</div>
                    <div className="text-[10px] text-muted-foreground">
                      10:47 AM
                    </div>
                  </div>
                  <div className="mt-1 p-2 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs">
                    Yes, check auth.tsx line 42. I implemented token rotation.
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-[10px] border border-green-500/30 mt-0.5">
                  S
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-xs">Sarah</div>
                    <div className="text-[10px] text-muted-foreground">
                      10:49 AM
                    </div>
                  </div>
                  <div className="mt-1 space-y-2">
                    <div className="p-2 rounded-md bg-green-500/10 border border-green-500/20 text-xs">
                      Perfect! The implementation looks good. I like how you
                      handled token expiration.
                    </div>
                    <div className="bg-black/40 border border-white/10 rounded-md p-2 text-xs">
                      <div className="flex items-center gap-2 mb-1">
                        <Code2 className="h-3 w-3 text-primary" />
                        <span className="text-muted-foreground">
                          auth.tsx, line 42-46
                        </span>
                      </div>
                      <div className="font-mono bg-black/30 p-2 rounded text-[10px] text-green-300">
                        const refreshToken = async () {"=> {"}
                        <br />
                        &nbsp;&nbsp;if (isRefreshing) return await tokenPromise;
                        <br />
                        &nbsp;&nbsp;tokenPromise = performRefresh();
                        <br />
                        &nbsp;&nbsp;return await tokenPromise;
                        <br />
                        {"}"}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4, duration: 0.3 }}
                className="flex items-start gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] border border-purple-500/30 mt-0.5">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-xs">Maria</div>
                    <div className="text-[10px] text-muted-foreground">
                      10:52 AM
                    </div>
                  </div>
                  <div className="mt-1 p-2 rounded-md bg-purple-500/10 border border-purple-500/20 text-xs">
                    <div className="mb-1">
                      Just joined the chat. Can I help with testing?
                    </div>
                    <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                      <span>Typing...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Chat input */}
            <div className="p-3 border-t border-white/10 bg-black/20">
              <div className="flex gap-2 items-center">
                <div className="flex-1 bg-black/30 rounded-md px-3 py-2 text-xs border border-white/10">
                  Type your message...
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-md flex items-center justify-center bg-primary/20 text-primary"
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
                    <path d="m22 2-7 20-4-9-9-4 20-7Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Code Snippet Popup */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 4.5, duration: 0.5 }}
            className="absolute bottom-20 right-4 bg-background/90 backdrop-blur-md rounded-md p-2 text-xs border border-white/10 max-w-[80%]"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Code2 className="h-3 w-3 text-primary" />
                <span>Share code snippet</span>
              </div>
              <div className="w-4 h-4 rounded hover:bg-white/10 flex items-center justify-center cursor-pointer">
                ×
              </div>
            </div>
            <div className="bg-black/50 p-2 rounded font-mono text-[10px] border border-white/10">
              <div className="text-muted-foreground"># Select language</div>
              <div className="mt-1">Paste code here...</div>
            </div>
            <div className="mt-2 flex justify-end">
              <div className="px-2 py-1 bg-primary/20 text-primary rounded cursor-pointer text-[10px]">
                Share
              </div>
            </div>
          </motion.div>
        </div>
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
          <MessageSquare className="h-5 w-5 text-primary" />
        </motion.div>
      </div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
      >
        <Card className="p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.div variants={pulseVariants} animate="pulse" className="mb-6">
            <motion.div
              whileHover={{
                scale: [1, 1.2, 1],
                transition: { duration: 0.5 },
              }}
              className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
            >
              <MessageSquare className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-semibold mb-3 relative z-10">
            Chat Integration
          </h3>
          <p className="text-muted-foreground relative z-10">
            Built-in chat functionality allows team members to communicate
            without leaving the coding environment. Discuss code and share ideas
            in real-time.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
