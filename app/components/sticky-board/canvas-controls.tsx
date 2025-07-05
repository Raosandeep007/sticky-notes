import React from "react";
import { motion } from "framer-motion";
import { MINIMUM_SCALE, MAXIMUM_SCALE } from "./constants";
import { Divide, DivideIcon, RotateCcw, TimerResetIcon } from "lucide-react";
import { cn } from "~/lib/utils";

interface CanvasControlsProps {
  canvasScale: number;
  isEditingNote: boolean;
  onSetZoom: (scale: number) => void;
  onResetView: () => void;
}

export function CanvasControls({
  canvasScale,
  isEditingNote,
  onSetZoom,
  onResetView,
}: CanvasControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-4 right-4 flex flex-col gap-2 z-50"
    >
      {/* Zoom Slider with Percentage */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg p-1.5">
        <div className="flex items-center gap-2.5">
          <input
            type="range"
            min={MINIMUM_SCALE}
            max={MAXIMUM_SCALE}
            step={0.1}
            value={canvasScale}
            onChange={(e) =>
              !isEditingNote && onSetZoom(parseFloat(e.target.value))
            }
            disabled={isEditingNote}
            className={`flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider ${
              isEditingNote ? "opacity-50 cursor-not-allowed" : ""
            }`}
            style={{
              background: isEditingNote
                ? "#e2e8f0"
                : `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    ((canvasScale - MINIMUM_SCALE) /
                      (MAXIMUM_SCALE - MINIMUM_SCALE)) *
                    100
                  }%, #e2e8f0 ${
                    ((canvasScale - MINIMUM_SCALE) /
                      (MAXIMUM_SCALE - MINIMUM_SCALE)) *
                    100
                  }%, #e2e8f0 100%)`,
            }}
          />
          <div className="text-xs font-medium text-slate-600 text-center min-w-8">
            {Math.round(canvasScale * 100)}%
          </div>
          <div className="h-6 border-l border-slate-300" />
          {/* Reset Button with Icon */}
          <motion.button
            whileHover={{ scale: !isEditingNote ? 1.05 : 1 }}
            whileTap={{ scale: !isEditingNote ? 0.95 : 1 }}
            onClick={() => !isEditingNote && onResetView()}
            className={cn({
              "bg-white/50 text-slate-400 cursor-not-allowed": isEditingNote,
              "bg-white/90 hover:bg-white text-slate-700": !isEditingNote,
            })}
            title={
              isEditingNote
                ? "Finish editing to use controls"
                : "Reset View (R)"
            }
            disabled={isEditingNote}
          >
            <RotateCcw size={16} />
          </motion.button>
        </div>
      </div>

      {/* Keyboard shortcuts hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isEditingNote ? 0.3 : 0.7 }}
        className={`sm:block hidden backdrop-blur-sm border border-slate-200 px-2 py-1 rounded text-[10px] text-center transition-colors ${
          isEditingNote
            ? "bg-white/50 text-slate-400"
            : "bg-white/80 text-slate-500"
        }`}
      >
        +/- to zoom • R to reset
      </motion.div>
    </motion.div>
  );
}
