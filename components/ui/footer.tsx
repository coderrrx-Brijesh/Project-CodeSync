"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-8 border-t border-white/10 relative overflow-hidden">
      {/* Subtle glow effect for the footer */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent"></div>

      {/* Animated particles in footer */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{ left: "15%", top: "20%" }}
          animate={{
            y: [0, 15, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{ left: "35%", top: "70%" }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{ left: "65%", top: "30%" }}
          animate={{
            y: [0, 8, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
        />
        <motion.div
          className="absolute w-1 h-1 rounded-full bg-white/20"
          style={{ left: "85%", top: "60%" }}
          animate={{
            y: [0, -12, 0],
            opacity: [0.12, 0.32, 0.12],
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 3 }}
        />
      </div>

      <div className="container mx-auto px-4 text-center text-muted-foreground relative z-10">
        <div className="flex justify-center items-center mb-6">
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="relative">
                {/* Glow effect around logo */}
                <motion.div
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-500/10 rounded-full blur-md"
                />
                <Code2 className="h-6 w-6 mr-2 text-primary relative z-10" />
              </div>
              <p className="text-lg font-semibold">CodeSync</p>
            </motion.div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <motion.div whileHover={{ scale: 1.05, x: 3 }}>
            <Link
              href="/about"
              className="text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors duration-200"
            >
              About
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, x: 3 }}>
            <Link
              href="/learn-more"
              className="text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors duration-200"
            >
              Features
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, x: 3 }}>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors duration-200"
            >
              Pricing
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, x: 3 }}>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors duration-200"
            >
              Contact
            </Link>
          </motion.div>
        </div>

        <p className="text-sm">
          © {new Date().getFullYear()} CodeSync. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
