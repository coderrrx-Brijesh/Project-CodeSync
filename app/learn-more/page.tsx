"use client";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import {
  Code2,
  ArrowLeft,
  Zap,
  Users,
  Video,
  GitBranch,
  ShieldCheck,
  MessageSquare,
  Lightbulb,
  Sparkles,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AiCodingShowcase from "@/components/ui/ai-coding-showcase";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

export default function LearnMore() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        {/* Main blob animations */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Small floating particles for added depth */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Fixed position particles with deterministic animations */}
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "20%", top: "30%" }}
            animate={{
              y: [0, 20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1, 0.8],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "65%", top: "10%" }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.4, 0.2],
              scale: [0.7, 0.9, 0.7],
            }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "40%", top: "70%" }}
            animate={{
              y: [0, 10, 0],
              opacity: [0.3, 0.5, 0.3],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{ duration: 9, repeat: Infinity, delay: 2 }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "80%", top: "40%" }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.15, 0.35, 0.15],
              scale: [0.85, 1.05, 0.85],
            }}
            transition={{ duration: 11, repeat: Infinity, delay: 3 }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "10%", top: "60%" }}
            animate={{
              y: [0, 15, 0],
              opacity: [0.25, 0.45, 0.25],
              scale: [0.75, 0.95, 0.75],
            }}
            transition={{ duration: 7, repeat: Infinity, delay: 4 }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "30%", top: "20%" }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.18, 0.38, 0.18],
              scale: [0.82, 1.02, 0.82],
            }}
            transition={{ duration: 12, repeat: Infinity, delay: 5 }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "50%", top: "80%" }}
            animate={{
              y: [0, 18, 0],
              opacity: [0.22, 0.42, 0.22],
              scale: [0.88, 1.08, 0.88],
            }}
            transition={{ duration: 9.5, repeat: Infinity, delay: 6 }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white/10"
            style={{ left: "85%", top: "75%" }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.12, 0.32, 0.12],
              scale: [0.92, 1.12, 0.92],
            }}
            transition={{ duration: 8.5, repeat: Infinity, delay: 7 }}
          />
        </div>

        {/* Main lighting effects */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/3 right-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.2, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"
        />

        {/* New dynamic lighting elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [0.8, 1.2, 0.8],
            x: [-10, 10, -10],
            y: [-10, 10, -10],
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"
        />

        {/* Subtle pulse effect in the center */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.1, 0],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-blue-500/10 to-transparent rounded-full blur-2xl"
        />
      </div>

      {/* Back to Home button */}
      <div className="relative z-10 flex justify-start mt-[2%] ml-[2%]">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <Button
            variant="ghost"
            size="sm"
            className="relative backdrop-blur-md bg-background/20 border border-white/10 hover:border-white/30 transition-all duration-300 rounded-lg"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 sm:px-6 py-10 md:py-20 text-center relative"
      >
        <motion.div variants={itemVariants} className="relative w-full mb-8">
          <div className="flex flex-row justify-center items-center">
            <motion.div
              animate={{
                rotate: [0, 5, 0, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="mr-3 relative"
            >
              {/* Glow behind the icon */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [0.9, 1.05, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-blue-500/20 rounded-full blur-md"
              />
              <div className="relative">
                <Code2 className="h-12 w-12 sm:h-16 sm:w-16 text-primary relative z-10" />
              </div>
            </motion.div>
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
              animate={{
                backgroundPosition: ["0% center", "100% center", "0% center"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% auto",
              }}
            >
              CodeSync
            </motion.h1>
          </div>

          {/* Enhanced underline with animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, width: "20%" }}
            animate={{ opacity: 1, scale: 1, width: "180px" }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            style={{
              bottom: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />

          {/* Subtle light beams emanating from the title */}
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-20 bg-gradient-radial from-blue-500/5 to-transparent blur-2xl pointer-events-none"
          />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-muted-foreground mb-16 max-w-2xl mx-auto"
        >
          Discover the innovative technology and features that make CodeSync the
          ultimate collaborative coding platform.
        </motion.p>
      </motion.div>

      {/* Main content section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* About Section */}
        <motion.section
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 relative">
                What is CodeSync?
                <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </h2>
              <p className="text-muted-foreground mb-4 text-base sm:text-lg">
                CodeSync is a revolutionary platform that transforms how
                development teams collaborate on code. Built with modern
                technologies and designed with developers in mind, CodeSync
                eliminates the barriers that slow down traditional collaborative
                coding.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg">
                Whether you're pair programming, conducting code reviews, or
                teaching coding concepts, CodeSync provides a seamless
                environment where multiple developers can code together in
                real-time, communicate effectively, and track changes with
                unprecedented clarity.
              </p>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-xl border border-white/10 bg-black/20 backdrop-blur-md shadow-xl"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-xl blur-md opacity-50"></div>

                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-70"></div>
                <div className="p-6 relative">
                  <div className="flex justify-center mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="relative w-32 h-32 sm:w-40 sm:h-40"
                    >
                      <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 border-dashed"></div>
                      <div
                        className="absolute inset-2 rounded-full border-2 border-purple-500/20 border-dashed"
                        style={{ animationDelay: "2s" }}
                      ></div>
                      <div
                        className="absolute inset-4 rounded-full border-2 border-cyan-500/20 border-dashed"
                        style={{ animationDelay: "4s" }}
                      ></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400/80" />
                      </div>
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3">
                    The Future of Collaborative Coding
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <span className="text-sm">Real-time Synchronization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-400" />
                      <span className="text-sm">Multi-user Support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-green-400" />
                      <span className="text-sm">Secure Connections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm">Version Control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-red-400" />
                      <span className="text-sm">HD Video Calls</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-indigo-400" />
                      <span className="text-sm">Team Chat System</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm">AI Coding Assistant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      <span className="text-sm">Smart Suggestions</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Key Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20 px-2 sm:px-4"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 text-center relative">
            Key Features
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              variants={itemVariants}
              className="h-full"
            >
              <div className="relative">
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>

                <Card className="relative p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    variants={pulseVariants}
                    animate="pulse"
                    className="mb-6"
                  >
                    <motion.div
                      whileHover={{
                        rotate: [0, 15, 0, -15, 0],
                        transition: { duration: 0.5 },
                      }}
                      className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                    >
                      <Users className="h-8 w-8 text-primary" />
                      {/* Subtle glow around icon */}
                      <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-sm"></div>
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 relative z-10">
                    Collaborative Editing
                  </h3>
                  <p className="text-muted-foreground relative z-10">
                    Multiple developers can edit the same file simultaneously
                    with real-time updates. See each others' cursors,
                    selections, and changes as they happen, making pair
                    programming effortless.
                  </p>
                </Card>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              variants={itemVariants}
              className="h-full"
            >
              <div className="relative">
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>

                <Card className="relative p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    variants={pulseVariants}
                    animate="pulse"
                    className="mb-6"
                  >
                    <motion.div
                      whileHover={{
                        y: [0, -5, 0],
                        transition: { duration: 0.5 },
                      }}
                      className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center"
                    >
                      <Video className="h-8 w-8 text-primary" />
                      {/* Subtle glow around icon */}
                      <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-sm"></div>
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 relative z-10">
                    Integrated Communication
                  </h3>
                  <p className="text-muted-foreground relative z-10">
                    Built-in video conferencing and chat functionality allow
                    team members to discuss code changes without leaving the
                    coding environment, streamlining the collaboration process.
                  </p>
                </Card>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              variants={itemVariants}
              className="h-full sm:col-span-2 lg:col-span-1"
            >
              <div className="relative">
                {/* Card glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>

                <Card className="relative p-6 h-full backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden group hover:shadow-md hover:shadow-primary/5 transition-all duration-300">
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
                      <GitBranch className="h-8 w-8 text-primary" />
                      {/* Subtle glow around icon */}
                      <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-sm"></div>
                    </motion.div>
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3 relative z-10">
                    Version Control
                  </h3>
                  <p className="text-muted-foreground relative z-10">
                    Seamless integration with version control systems allows
                    teams to track changes, manage branches, and commit code
                    directly from the collaborative environment.
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Technology Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center relative">
            Technology Stack
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </h2>

          <div className="relative">
            {/* Animated glowing effect */}
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent rounded-xl"
            />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 p-8 backdrop-blur-sm bg-black/20 rounded-xl border border-white/10">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-blue-400" />
                  <span>Frontend Technologies</span>
                </h3>
                <ul className="space-y-3">
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>React with Next.js for robust UI rendering</span>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>TypeScript for type-safe code</span>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Tailwind CSS for beautiful responsive design</span>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Framer Motion for fluid animations</span>
                  </motion.li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-400" />
                  <span>Backend Capabilities</span>
                </h3>
                <ul className="space-y-3">
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>WebSocket architecture for real-time data</span>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Conflict resolution algorithms</span>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Secure authentication and authorization</span>
                  </motion.li>
                  <motion.li
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>Scalable database architecture</span>
                  </motion.li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Why Choose CodeSync Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center relative">
            Why Choose CodeSync?
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md"></div>
              <Card className="relative h-full p-6 backdrop-blur-md bg-background/30 border border-white/10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="h-16 w-16 rounded-full bg-background border border-primary/50 flex items-center justify-center mb-6"
                >
                  <Lightbulb className="h-8 w-8 text-yellow-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-4">
                  Increased Productivity
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 mt-0.5 flex items-center justify-center rounded-full bg-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>
                      Reduce code review cycles by 75% through real-time
                      collaboration
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 mt-0.5 flex items-center justify-center rounded-full bg-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>
                      Eliminate context switching between communication and
                      coding tools
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 mt-0.5 flex items-center justify-center rounded-full bg-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>
                      Solve complex problems faster through shared visualization
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-md"></div>
              <Card className="relative h-full p-6 backdrop-blur-md bg-background/30 border border-white/10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="h-16 w-16 rounded-full bg-background border border-primary/50 flex items-center justify-center mb-6"
                >
                  <MessageSquare className="h-8 w-8 text-blue-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-4">
                  Enhanced Collaboration
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-500/20">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>
                      Bridge the gap between remote and in-office team members
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-500/20">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>
                      Accelerate onboarding by allowing new developers to learn
                      in real-time
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 mt-0.5 flex items-center justify-center rounded-full bg-blue-500/20">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <span>
                      Build stronger team cohesion through shared coding
                      experiences
                    </span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* Advanced Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold mb-10 text-center relative">
            Advanced Communication Features
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Call Feature */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-md"></div>
              <Card className="relative h-full p-6 backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden">
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 rounded-full bg-background/50 flex items-center justify-center">
                    <Video className="h-10 w-10 text-blue-400" />
                    <div className="absolute w-full h-full rounded-full border-2 border-blue-400/30 animate-ping"></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  HD Video Conferencing
                </h3>
                <div className="bg-black/40 rounded-lg overflow-hidden mb-4 h-[62%] flex flex-col justify-between">
                  <div className="bg-black/60 p-2 text-sm border-b border-white/10 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>Live Session</span>
                    </div>
                    <span className="text-xs text-white/70">12:42</span>
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xs">JD</span>
                        </div>
                        <span className="text-xs">John Doe</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        <span className="text-xs">Speaking</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <span className="text-xs">AS</span>
                        </div>
                        <span className="text-xs">Alice Smith</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-500/80"></div>
                        <span className="text-xs">Muted</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/60 p-2 flex justify-center gap-10">
                    <div className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center">
                      <span className="text-xs">End</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-500/80 flex items-center justify-center">
                      <span className="text-xs">📹</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-500/80 flex items-center justify-center">
                      <span className="text-xs">🎤</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-sm">
                      HD quality video with adaptive streaming
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-sm">
                      Screen sharing with annotation tools
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    </div>
                    <span className="text-sm">
                      Up to 50 participants in a single call
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Chat System Feature */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-md"></div>
              <Card className="relative h-full p-6 backdrop-blur-md bg-background/30 border border-white/10 overflow-hidden">
                <div className="flex justify-center mb-6">
                  <div className="relative w-20 h-20 rounded-full bg-background/50 flex items-center justify-center">
                    <MessageSquare className="h-10 w-10 text-purple-400" />
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute w-full h-full rounded-full border-2 border-purple-400/30"
                    ></motion.div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-center">
                  Real-time Chat System
                </h3>
                <div className="bg-black/40 rounded-lg overflow-hidden mb-4 h-[62%]">
                  <div className="bg-black/60 p-2 text-sm border-b border-white/10">
                    <span>Team Chat</span>
                  </div>
                  <div className="p-3 flex flex-col gap-3 h-full overflow-y-auto">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs">JD</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">John</span>
                          <span className="text-xs text-white/50">
                            10:42 AM
                          </span>
                        </div>
                        <p className="text-xs bg-blue-500/10 p-2 rounded-md max-w-[180px]">
                          I've pushed a fix for the login issue. Can someone
                          review it?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs">AS</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">Alice</span>
                          <span className="text-xs text-white/50">
                            10:45 AM
                          </span>
                        </div>
                        <p className="text-xs bg-purple-500/10 p-2 rounded-md max-w-[180px]">
                          I'll take a look now. Are there any specific areas I
                          should focus on?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs">JD</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">John</span>
                          <span className="text-xs text-white/50">
                            10:47 AM
                          </span>
                        </div>
                        <p className="text-xs bg-blue-500/10 p-2 rounded-md max-w-[180px]">
                          Check the authentication flow in auth.js
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/60 p-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="bg-background/20 text-xs p-2 rounded-md w-full outline-none border border-white/10"
                    />
                    <button className="bg-purple-500/80 p-1 rounded-md">
                      <span className="text-xs">Send</span>
                    </button>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    </div>
                    <span className="text-sm">
                      Channel-based team communication
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    </div>
                    <span className="text-sm">
                      Direct messaging with team members
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    </div>
                    <span className="text-sm">
                      Code snippets and file sharing
                    </span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* AI Assistant Feature */}
            <AiCodingShowcase />
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="relative max-w-3xl mx-auto">
            {/* Enhanced animated glow effect */}
            <motion.div
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [0.95, 1, 0.95],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/30 to-blue-500/20 rounded-xl blur-xl"
            />

            <Card className="relative p-6 sm:p-8 backdrop-blur-md bg-background/30 border border-white/10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Revolutionize Your Workflow?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join thousands of development teams who have transformed their
                coding experience with CodeSync. Start collaborating in
                real-time and see the difference today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Button glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <Button
                    size="lg"
                    className="relative overflow-hidden group shadow-lg rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {/* Enhanced shimmer effect */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer" />
                    <span className="relative z-10">
                      <Link href="/signup" className="flex items-center gap-2">
                        Get Started{" "}
                        <Zap className="h-4 w-4 ml-1 group-hover:animate-pulse" />
                      </Link>
                    </span>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group"
                >
                  {/* Button glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-lg blur opacity-20 group-hover:opacity-90 transition duration-1000 group-hover:duration-200"></div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="relative backdrop-blur-md border-white/20 hover:border-white/40 rounded-lg"
                  >
                    <span className="relative z-10">
                      <Link href="/" className="flex items-center gap-2">
                        Explore Features{" "}
                        <ArrowLeft className="h-4 w-4 ml-1 group-hover:-translate-x-1 transition-transform duration-300" />
                      </Link>
                    </span>
                  </Button>
                </motion.div>
              </div>
            </Card>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
