import React from "react";
import { motion } from "framer-motion";
import { MINIMUM_SCALE, MAXIMUM_SCALE } from "./constants";

interface CanvasControlsProps {
  canvasScale: number;
  isEditingNote: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export function CanvasControls({
  canvasScale,
  isEditingNote,
  onZoomIn,
  onZoomOut,
  onResetView,
}: CanvasControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-4 right-4 flex flex-col gap-2 z-50"
    >
      {/* Zoom Controls */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: !isEditingNote ? 1.1 : 1 }}
            whileTap={{ scale: !isEditingNote ? 0.9 : 1 }}
            onClick={() => !isEditingNote && onZoomOut()}
            className={`px-3 py-2 transition-colors text-lg font-bold border-r border-slate-200 ${
              isEditingNote || canvasScale <= MINIMUM_SCALE
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            disabled={isEditingNote || canvasScale <= MINIMUM_SCALE}
          >
            −
          </motion.button>
          <div className="px-3 py-2 text-xs font-medium text-slate-600 min-w-[60px] text-center">
            {Math.round(canvasScale * 100)}%
          </div>
          <motion.button
            whileHover={{ scale: !isEditingNote ? 1.1 : 1 }}
            whileTap={{ scale: !isEditingNote ? 0.9 : 1 }}
            onClick={() => !isEditingNote && onZoomIn()}
            className={`px-3 py-2 transition-colors text-lg font-bold border-l border-slate-200 ${
              isEditingNote || canvasScale >= MAXIMUM_SCALE
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            disabled={isEditingNote || canvasScale >= MAXIMUM_SCALE}
          >
            +
          </motion.button>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: !isEditingNote ? 1.05 : 1 }}
        whileTap={{ scale: !isEditingNote ? 0.95 : 1 }}
        onClick={() => !isEditingNote && onResetView()}
        className={`backdrop-blur-sm border border-slate-200 px-3 py-2 rounded-lg shadow-lg transition-colors text-xs font-medium ${
          isEditingNote
            ? "bg-white/50 text-slate-400 cursor-not-allowed"
            : "bg-white/90 hover:bg-white text-slate-700"
        }`}
        title={
          isEditingNote ? "Finish editing to use controls" : "Reset View (R)"
        }
        disabled={isEditingNote}
      >
        Reset View
      </motion.button>

      {/* Keyboard shortcuts hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isEditingNote ? 0.3 : 0.7 }}
        className={`backdrop-blur-sm border border-slate-200 px-2 py-1 rounded text-[10px] text-center transition-colors ${
          isEditingNote
            ? "bg-white/50 text-slate-400"
            : "bg-white/80 text-slate-500"
        }`}
      >
        {isEditingNote
          ? "Finish editing to use shortcuts"
          : "+/- to zoom • R to reset"}
      </motion.div>
    </motion.div>
  );
}
