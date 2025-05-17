import { Card } from "@/components/ui/card";
import { Pointer } from "lucide-react";
import { motion } from "framer-motion";
import { pulseVariants } from "@/lib/animation-types";
import LiveCursorDemo from "@/components/home/live-cursor-demo";

export default function FeatureLiveCursors() {
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
              className="relative z-10 h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ml-auto md:ml-auto"
            >
              <Pointer className="h-8 w-8 text-primary" />
            </motion.div>
          </motion.div>
          <h3 className="text-xl font-semibold mb-3 relative z-10">
            Live Cursors
          </h3>
          <p className="text-muted-foreground relative z-10">
            See your teammates' cursors and selections in real-time, making
            collaboration intuitive and natural. Each collaborator has their own
            uniquely colored cursor.
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
          <Pointer className="h-5 w-5 text-primary" />
        </motion.div>
      </div>
      <LiveCursorDemo />
    </div>
  );
}
