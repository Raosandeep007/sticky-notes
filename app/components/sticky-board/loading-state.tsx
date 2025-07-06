import React from "react";
import { motion } from "framer-motion";

export function LoadingState() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const noteVariants = {
    hidden: {
      scale: 0,
      rotate: -10,
      opacity: 0,
    },
    visible: {
      scale: 1,
      rotate: Math.random() * 20 - 10, // Random rotation between -10 and 10 degrees
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 300,
        duration: 0.8,
      },
    },
  };

  const colors = [
    "from-yellow-200 via-yellow-300 to-yellow-200",
    "from-blue-200 via-blue-300 to-blue-200",
    "from-green-200 via-green-300 to-green-200",
    "from-pink-200 via-pink-300 to-pink-200",
    "from-purple-200 via-purple-300 to-purple-200",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-2">
          Sticky Notes
        </h1>
        <p className="text-slate-500 text-center">
          Setting up your workspace...
        </p>
      </motion.div>

      {/* Animated Notes */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-3 sm:gap-6 justify-center max-w-md"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} variants={noteVariants} className="relative">
            <motion.div
              animate={{
                y: [-4, 4, -4],
                rotate: [-2, 2, -2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
              className={`
                w-20 h-20 sm:w-28 sm:h-28 
                bg-gradient-to-br ${colors[i]}
                rounded-lg shadow-lg 
                border border-white/50
                backdrop-blur-sm
                relative overflow-hidden
                cursor-pointer
                transform-gpu
              `}
            >
              {/* Shimmer Effect */}
              <motion.div
                animate={{
                  x: [-100, 100],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.3,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform skew-x-12"
              />

              {/* Mock Content Lines */}
              <div className="absolute inset-3 flex flex-col gap-1">
                <div className="h-1 bg-slate-400/30 rounded-full w-3/4"></div>
                <div className="h-1 bg-slate-400/30 rounded-full w-1/2"></div>
                <div className="h-1 bg-slate-400/30 rounded-full w-2/3"></div>
              </div>

              {/* Folded Corner */}
              <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-bl from-white/40 to-transparent transform rotate-45 translate-x-2 -translate-y-2"></div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Loading Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex gap-2 mt-8"
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="w-2 h-2 bg-slate-400 rounded-full"
          />
        ))}
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, width: 0 }}
        animate={{ opacity: 1, width: "100%" }}
        transition={{ delay: 0.5, duration: 2 }}
        className="mt-6 w-48 h-1 bg-slate-200 rounded-full overflow-hidden"
      >
        <motion.div
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-1/3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
        />
      </motion.div>
    </div>
  );
}
