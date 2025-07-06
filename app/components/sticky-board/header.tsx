import { Plus, Settings, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";

interface StickyBoardHeaderProps {
  notesCount: number;
  onCreateNote: () => void;
  onOpenSettings: () => void;
  onOpenNotesList: () => void;
}

export function StickyBoardHeader({
  notesCount,
  onCreateNote,
  onOpenSettings,
  onOpenNotesList,
}: StickyBoardHeaderProps) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!", {
        duration: 3000,
        position: "top-center",
      });
    } catch (err) {
      console.error("Failed to copy URL:", err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Link copied to clipboard!", {
        duration: 3000,
        position: "top-center",
      });
    }
  };
  return (
    <div className="absolute m-3 top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-white/20 shadow-sm flex items-center justify-between p-2 rounded-full">
      <button
        onClick={onOpenNotesList}
        className="text-sm text-slate-500 bg-slate-300 px-3 py-1 rounded-full hover:bg-slate-400 hover:text-white transition-colors cursor-pointer"
        title={`View all ${notesCount} note${notesCount !== 1 ? "s" : ""}`}
      >
        {notesCount}
      </button>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          onClick={handleShare}
          variant="outline"
          size="sm"
          className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-xs sm:text-sm px-2 sm:px-3"
          title="Share this page"
        >
          <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button
          onClick={onOpenSettings}
          variant="outline"
          size="sm"
          className="text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-xs sm:text-sm px-2 sm:px-3"
        >
          <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Button>
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
