import { Card } from "@/components/ui/card";
import { GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { pulseVariants } from "@/lib/animation-types";

export default function FeatureGit() {
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
              whileHover={{
                rotate: [0, 15, 0, -15, 0],
                transition: { duration: 0.5 },
              }}
              className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ml-auto"
            >
              <GitBranch className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-semibold mb-3 relative z-10">
            Git Integration
          </h3>
          <p className="text-muted-foreground relative z-10">
            Seamlessly integrate with Git workflows. Commit, branch, and manage
            your repositories directly from the CodeSync interface with visual
            change indicators.
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
          <GitBranch className="h-5 w-5 text-primary" />
        </motion.div>
      </div>

      <motion.div
        initial={{ x: 50, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="md:w-1/2 md:pl-8 mt-8 md:mt-0"
      >
        {/* Git Integration Interactive Demo */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-md shadow-xl">
          <div className="bg-black/40 py-2 px-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-primary" />
              <div className="text-sm">Git Control</div>
            </div>
            <div className="bg-background/20 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>main</span>
            </div>
          </div>

          <div className="p-4">
            {/* Branch Visualization */}
            <div className="relative h-20 mb-4 overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 400 80">
                {/* Main branch */}
                <path d="M20,40 L380,40" stroke="#444" strokeWidth="2" />

                {/* Feature branch */}
                <path
                  d="M100,40 C120,40 120,20 140,20 L240,20"
                  stroke="#666"
                  strokeWidth="2"
                />

                {/* Merge branch back */}
                <path
                  d="M240,20 C260,20 260,40 280,40"
                  stroke="#666"
                  strokeWidth="2"
                />

                {/* Commit dots */}
                <circle cx="20" cy="40" r="5" fill="#444" />
                <circle cx="60" cy="40" r="5" fill="#444" />
                <circle cx="100" cy="40" r="5" fill="#444" />
                <circle cx="140" cy="20" r="5" fill="#666" />
                <circle cx="180" cy="20" r="5" fill="#666" />
                <circle cx="240" cy="20" r="5" fill="#666" />
                <circle cx="280" cy="40" r="5" fill="#8844dd" />

                {/* Animated highlighted commit dot */}
                <motion.circle
                  cx="280"
                  cy="40"
                  r="8"
                  fill="transparent"
                  stroke="#8844dd"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    r: [5, 10, 5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />

                <circle cx="340" cy="40" r="5" fill="#444" />

                {/* Branch labels */}
                <text x="180" y="15" fontSize="10" fill="#888">
                  feature/user-auth
                </text>
                <text x="340" y="35" fontSize="10" fill="#888">
                  main
                </text>
              </svg>
            </div>

            {/* Commit Details */}
            <div className="bg-black/30 rounded-md p-3 border border-white/5 font-mono text-sm mb-4">
              <div className="flex gap-2 items-center">
                <div className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                  HEAD
                </div>
                <div className="text-green-400">main</div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="mt-2 flex items-center gap-1 text-xs">
                  <div className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center">
                    <GitBranch className="h-2 w-2 text-primary" />
                  </div>
                  <div className="text-muted-foreground">Last commit:</div>
                  <div className="font-medium">8c42a1</div>
                  <div className="text-muted-foreground">by</div>
                  <div className="font-medium">Alex K.</div>
                </div>

                <div className="mt-2 text-xs">
                  Merge:{" "}
                  <span className="text-blue-400">feature/user-auth</span> →{" "}
                  <span className="text-green-400">main</span>
                </div>

                <div className="mt-2 text-xs text-primary">
                  Added user authentication system with JWT support
                </div>
              </motion.div>
            </div>

            {/* Changed Files */}
            <div className="space-y-2 mb-4">
              <div className="text-xs text-muted-foreground flex items-center justify-between">
                <span>Changed files</span>
                <span>+412 −28</span>
              </div>

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="space-y-1 overflow-hidden"
              >
                <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-green-500">
                  <div className="flex items-center gap-1">
                    <div className="text-green-500">+</div>
                    <span>auth/login.tsx</span>
                  </div>
                  <div className="text-green-500">+124</div>
                </div>

                <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-green-500">
                  <div className="flex items-center gap-1">
                    <div className="text-green-500">+</div>
                    <span>auth/register.tsx</span>
                  </div>
                  <div className="text-green-500">+156</div>
                </div>

                <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-yellow-500">
                  <div className="flex items-center gap-1">
                    <div className="text-yellow-500">~</div>
                    <span>lib/auth.tsx</span>
                  </div>
                  <div>
                    <span className="text-green-500">+98</span>{" "}
                    <span className="text-red-500">−12</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/20 px-2 py-1 rounded text-xs border-l-2 border-yellow-500">
                  <div className="flex items-center gap-1">
                    <div className="text-yellow-500">~</div>
                    <span>components/Navbar.tsx</span>
                  </div>
                  <div>
                    <span className="text-green-500">+34</span>{" "}
                    <span className="text-red-500">−16</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-primary/20 text-primary text-xs rounded-md flex-1 text-center cursor-pointer"
              >
                New Branch
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-background/30 text-xs rounded-md flex-1 text-center cursor-pointer"
              >
                Commit Changes
              </motion.div>
            </div>
          </div>

          {/* Notification Popup */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="absolute top-12 right-3 bg-background/80 backdrop-blur-sm rounded-md px-3 py-2 text-xs border border-white/10 max-w-[60%]"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Pull request #42 merged successfully</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
