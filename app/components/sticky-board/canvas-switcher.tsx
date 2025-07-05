import React from "react";
import { ChevronDown, FolderOpen } from "lucide-react";
import { type Canvas } from "./hooks/use-canvas-management";

interface CanvasSwitcherProps {
  activeCanvas: Canvas | null;
  onClick: () => void;
}

export function CanvasSwitcher({ activeCanvas, onClick }: CanvasSwitcherProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200/50 hover:bg-white hover:border-gray-300 transition-all text-sm font-medium text-gray-700 shadow-sm"
      title="Open Canvas Manager"
    >
      <FolderOpen className="w-4 h-4" />
      <span className="max-w-24 sm:max-w-32 truncate">
        {activeCanvas?.name || "Select Canvas"}
      </span>
      <ChevronDown className="w-3 h-3" />
    </button>
  );
}
