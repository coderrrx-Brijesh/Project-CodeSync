import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
const CTASection = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-lg rounded-xl border border-white/10 p-8 overflow-hidden relative"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -right-32 -bottom-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl font-bold mb-4 relative z-10"
        >
          Ready to transform your coding workflow?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-muted-foreground mb-8 relative z-10"
        >
          Start collaborating with your team in real-time today. No more merge
          conflicts, no more waiting for PR reviews.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10"
        >
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
            <Link href="/editor">Start Coding Together</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CTASection;
