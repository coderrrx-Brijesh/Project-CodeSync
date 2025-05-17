"use client";
import CodeButton from "@/components/code-button";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  scrollIndicatorAnimation,
} from "@/lib/animation-types";
import Navbar from "@/components/navbar";
import FeatureLiveCursors from "@/components/home/feature-live-cursors";
import FeatureRealtimeCollab from "@/components/home/feature-realtime-collab";
import FeatureVideoCalls from "@/components/home/feature-video-calls";
import FeatureFileSystem from "@/components/home/feature-filesystem";
import FeatureGit from "@/components/home/feature-git";
import FeatureChat from "@/components/home/feature-chat";
import CodeEditorDemo from "@/components/home/code-editor-demo";
import CTASection from "@/components/home/cta-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Nav */}
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-16 text-center"
      >
        <motion.div variants={itemVariants} className="relative w-full mb-16">
          <div className="relative inline-flex justify-center items-center gap-[1px] sm:gap-1 md:gap-1 text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            <span>Code</span>
            <img src="/bolt.svg" className="h-[50%] w-[15%] -m-[5%]" />
            <span>Sync</span>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute -bottom-[10%] left-[54%] -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
        >
          A state-of-the-art platform for real-time collaborative code editing,
          designed for seamless teamwork and pair programming.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex gap-4 justify-center"
        >
          <motion.div>
            <CodeButton />
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="lg"
              className="backdrop-blur-sm border-white/20 hover:border-white/40"
            >
              <Link href="/learn-more">Learn More</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <div className="flex justify-center mb-8">
        <motion.div
          animate={scrollIndicatorAnimation.animate}
          transition={scrollIndicatorAnimation.transition}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Discover Features</span>
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </div>

      {/* Timeline Features Section */}
      <div className="container mx-auto px-4 py-12 relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent transform -translate-x-1/2 z-0"></div>

        <FeatureLiveCursors />
        <FeatureRealtimeCollab />
        <FeatureVideoCalls />
        <FeatureFileSystem />
        <FeatureGit />
        <FeatureChat />
      </div>

      {/* {Code Editor showcase} */}
      <CodeEditorDemo />
      {/* CTA Section */}
      <CTASection />

      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .bg-grid-white\/5 {
          background-size: 40px 40px;
          background-image: linear-gradient(
              to right,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
        }
      `}</style>
    </main>
  );
}
