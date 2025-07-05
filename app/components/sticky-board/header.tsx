import React from "react";
import { Button } from "~/components/ui/button";
import { Plus, Palette, RotateCcw, StickyNote, Pin } from "lucide-react";

interface StickyBoardHeaderProps {
  notesCount: number;
  onCreateNote: () => void;
  onClearAll: () => void;
}

export function StickyBoardHeader({
  notesCount,
  onCreateNote,
  onClearAll,
}: StickyBoardHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
      <div className="flex items-center justify-between p-2 sm:p-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <StickyNote className="size-3 sm:size-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pin Desk
            </h1>
          </div>
          <div className="hidden sm:block text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {notesCount} notes
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {notesCount > 0 && (
            <Button
              onClick={onClearAll}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm px-2 sm:px-3"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </Button>
          )}
          <Button
            onClick={onCreateNote}
            className="shadow-lg text-xs sm:text-sm px-2 sm:px-3"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Add Note</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
