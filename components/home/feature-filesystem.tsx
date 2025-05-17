import { Card } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { motion } from "framer-motion";
import { pulseVariants } from "@/lib/animation-types";

export default function FeatureFileSystem() {
  return (
    <div className="flex flex-col md:flex-row items-center mb-24 relative">
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="md:w-1/2 md:pr-8 mt-8 md:mt-0"
      >
        {/* Synchronized File System Interactive Demo */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
          <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <div className="text-sm">Project Explorer</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Synced</span>
            </div>
          </div>

          <div className="p-3 max-h-[320px] overflow-y-auto text-sm font-mono">
            {/* Project folder structure with visual change indicators */}
            <div className="space-y-0.5">
              <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                <div className="mr-2 text-muted-foreground">📁</div>
                <span className="font-medium">project-codesync</span>
              </div>

              <div className="ml-5">
                <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                  <div className="mr-2 text-muted-foreground">📁</div>
                  <span>app</span>
                </div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="ml-5 overflow-hidden"
                >
                  <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span>page.tsx</span>
                    <div className="ml-2 flex">
                      <div className="w-2 h-2 rounded-full bg-green-500/70"></div>
                    </div>
                  </div>

                  <div className="flex items-center py-1.5 px-2 rounded bg-primary/10 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span>layout.tsx</span>
                    <div className="ml-2 flex">
                      <div className="w-2 h-2 rounded-full bg-blue-500/70 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span>globals.css</span>
                  </div>
                </motion.div>

                <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                  <div className="mr-2 text-muted-foreground">📁</div>
                  <span>components</span>
                </div>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="ml-5 overflow-hidden"
                >
                  <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span>Button.tsx</span>
                  </div>

                  <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span>Card.tsx</span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 0.5 }}
                    className="flex items-center py-1.5 px-2 rounded-md hover:bg-white/5 cursor-pointer relative border border-purple-500/30 bg-purple-500/10"
                  >
                    <div className="mr-2 text-muted-foreground">📄</div>
                    <span className="text-purple-300">FileExplorer.tsx</span>
                    <div className="ml-2 flex">
                      <div className="rounded-full px-1.5 py-0.5 bg-purple-500/20 text-[10px] text-purple-300">
                        New
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                <div className="mr-2 text-muted-foreground">📁</div>
                <span>public</span>
              </div>

              <div className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer">
                <div className="mr-2 text-muted-foreground">📄</div>
                <span>package.json</span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4, duration: 0.5 }}
                className="flex items-center py-1.5 px-2 rounded hover:bg-white/5 cursor-pointer"
              >
                <div className="mr-2 text-muted-foreground">📄</div>
                <span>README.md</span>
                <div className="ml-2 flex">
                  <div className="w-2 h-2 rounded-full bg-yellow-500/70"></div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Activity and Status */}
          <div className="p-3 border-t border-white/10 bg-background/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="relative w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-30">
                    <span>A</span>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-blue-500"
                      >
                        <path
                          d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                          fill="currentColor"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="relative w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-20">
                    <span>M</span>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-purple-500"
                      >
                        <path
                          d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                          fill="currentColor"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="relative w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background z-10">
                    <span>J</span>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                      <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-green-500"
                      >
                        <path
                          d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                          fill="currentColor"
                          stroke="white"
                          strokeWidth="0.5"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  3 collaborators
                </span>
              </div>
            </div>
          </div>

          {/* Activity Notifications */}
          <motion.div
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
            className="absolute bottom-14 right-3 bg-background/80 backdrop-blur-sm rounded-md p-3 text-xs border border-purple-500/30 max-w-[80%] shadow-lg shadow-purple-500/10"
          >
            <div className="flex items-start gap-2">
              <div className="relative w-7 h-7 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white font-medium border-2 border-background mt-0.5">
                <span>M</span>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-background rounded-full flex items-center justify-center">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-purple-500"
                  >
                    <path
                      d="M4 2L20 18L13 18L11 22L8 12L4 2Z"
                      fill="currentColor"
                      stroke="white"
                      strokeWidth="0.5"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-medium text-xs">
                  Maria created{" "}
                  <span className="text-purple-300 font-semibold">
                    FileExplorer.tsx
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 6v6l4 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Just now
                </div>
              </div>
            </div>
          </motion.div>

          {/* File Operation Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 4.5, duration: 0.3 }}
            className="absolute bottom-24 left-28 bg-background/90 backdrop-blur-md rounded-md shadow-lg border border-white/10 text-sm overflow-hidden"
          >
            <div className="py-1">
              <div className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                <div className="text-primary text-xs">+</div>
                <span>New File</span>
              </div>
              <div className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                <div className="text-primary text-xs">+</div>
                <span>New Folder</span>
              </div>
              <div className="border-t border-white/10 my-1"></div>
              <div className="px-3 py-1.5 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                <Layers className="h-3 w-3 text-primary" />
                <span>Open</span>
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
          <Layers className="h-5 w-5 text-primary" />
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
              <Layers className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-semibold mb-3 relative z-10">
            Synchronized File System
          </h3>
          <p className="text-muted-foreground relative z-10">
            Your entire project structure synchronized in real-time. Create,
            rename, and modify files with instant updates across all team
            members.
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
