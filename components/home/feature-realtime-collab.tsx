import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { pulseVariants } from "@/lib/animation-types";

export default function FeatureRealtimeCollab() {
  return (
    <div className="flex flex-col md:flex-row items-center mb-24 relative">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="md:w-1/2 md:pr-8 mt-8 md:mt-0"
      >
        {/* Real-time Collaboration Interactive Demo */}
        <div className="rounded-xl overflow-hidden bg-black/20 border border-white/10 backdrop-blur-md shadow-xl">
          <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="text-sm">CodeSync Session</div>
            <div className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">
              Live
            </div>
          </div>

          <div className="p-4">
            <div className="bg-black/30 rounded-md p-3 border border-white/5 font-mono text-sm overflow-hidden">
              {/* Code that gets typed in real-time */}
              <div className="space-y-1">
                <div>
                  <span className="text-blue-400">import</span>{" "}
                  <span className="text-green-300">React</span>{" "}
                  <span className="text-blue-400">from</span>{" "}
                  <span className="text-yellow-300">'react'</span>;
                </div>
                <div>
                  <span className="text-blue-400">import</span>{" "}
                  <span className="text-green-300">{"{ useState }"}</span>{" "}
                  <span className="text-blue-400">from</span>{" "}
                  <span className="text-yellow-300">'react'</span>;
                </div>
                <div>&nbsp;</div>

                <div className="relative">
                  <span className="text-blue-400">function</span>{" "}
                  <span className="text-green-300">UserProfile</span>
                  <span className="text-foreground">
                    ({"{ userData }"}) {"{"}
                  </span>
                  {/* Typing animation indicators */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="absolute -right-5 top-1 text-blue-400 text-xs"
                  >
                    ●
                  </motion.div>
                </div>

                <div className="ml-4 relative">
                  <span className="text-purple-400">const</span>{" "}
                  <span className="text-foreground">[</span>
                  <span className="text-blue-300">isLoading</span>
                  <span className="text-foreground">, </span>
                  {/* Animated typing effect */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <span className="text-blue-300">setIsLoading</span>
                    <span className="text-foreground">] = </span>
                    <span className="text-purple-400">useState</span>
                    <span className="text-foreground">(</span>
                    <span className="text-orange-300">false</span>
                    <span className="text-foreground">);</span>
                  </motion.span>
                </div>

                <div className="ml-4 relative">
                  {/* Animated typing of new line */}
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 2, duration: 0.5 }}
                  >
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-foreground">[</span>
                    <span className="text-blue-300">profileData</span>
                    <span className="text-foreground">, </span>
                    <span className="text-blue-300">setProfileData</span>
                    <span className="text-foreground">] = </span>
                    <span className="text-purple-400">useState</span>
                    <span className="text-foreground">(userData);</span>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 3, duration: 0.5 }}
                >
                  <div className="ml-4">&nbsp;</div>
                  <div className="ml-4">
                    <span className="text-purple-400">useEffect</span>
                    <span className="text-foreground">{"(() => {"}</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-foreground">
                      // Load user data from API
                    </span>
                  </div>
                  <div className="ml-8 relative">
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-blue-300">loadUserData</span>{" "}
                    <span className="text-foreground">= </span>
                    <span className="text-purple-400">async</span>
                    <span className="text-foreground">{"() => {"}</span>
                    {/* Current typing cursor */}
                    <motion.div
                      animate={{ opacity: [0, 1, 1, 0] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 0,
                      }}
                      className="absolute h-4 w-1.5 bg-white right-0 ml-1 top-1"
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Change indicators */}
            <div className="mt-4 bg-background/30 backdrop-blur-sm rounded-md p-2 border border-white/10">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  J
                </div>
                <div>
                  <div className="text-xs font-medium">
                    John added useEffect hook
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    5 seconds ago
                  </div>
                </div>
              </div>
            </div>

            {/* User activity */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] z-20">
                    J
                  </div>
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[10px] z-10">
                    T
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Editing now
                </div>
              </div>

              <motion.div
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 4, duration: 0.5 }}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span>Changes saved</span>
                </div>
              </motion.div>
            </div>
          </div>
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
          <Users className="h-5 w-5 text-primary" />
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
          <motion.div
            variants={pulseVariants}
            animate="pulse"
            className="mb-6"
          >
            <motion.div
              whileHover={{
                scale: [1, 1.2, 1],
                transition: { duration: 0.5 },
              }}
              className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
            >
              <Users className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-semibold mb-3 relative z-10">
            Real-time Collaboration
          </h3>
          <p className="text-muted-foreground relative z-10">
            Code together in real-time with your team members, seeing
            changes instantly as they type. Never wait for pull requests to
            see code updates.
          </p>
        </Card>
      </motion.div>
    </div>
  );
} 