import { Plus, RotateCcw, Trash2, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";

interface StickyBoardHeaderProps {
  notesCount: number;
  onCreateNote: () => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
}

export function StickyBoardHeader({
  notesCount,
  onCreateNote,
  onClearAll,
  onOpenSettings,
}: StickyBoardHeaderProps) {
  return (
    <div className="absolute m-3 top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/20 shadow-sm flex items-center justify-between p-2 sm:p-4 rounded-full">
      <div className="text-sm text-slate-500 bg-slate-300 px-3 py-1 rounded-full">
        {notesCount}
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          onClick={onOpenSettings}
          variant="outline"
          size="sm"
          className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-xs sm:text-sm px-2 sm:px-3"
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
        {notesCount > 0 && (
          <Button
            onClick={onClearAll}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </Button>
        )}
        <Button
          size="sm"
          onClick={onCreateNote}
          className="shadow-lg text-xs sm:text-sm px-2 sm:px-3"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Add Note</span>
        </Button>
      </div>
    </div>
  );
}
