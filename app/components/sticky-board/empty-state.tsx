import React from "react";
import { Button } from "~/components/ui/button";
import { Plus, Palette } from "lucide-react";

interface EmptyStateProps {
  onCreateNote: () => void;
}

export function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Palette className="w-8 h-8 sm:w-12 sm:h-12 text-blue-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-700 mb-2">
          Your canvas awaits
        </h2>
        <p className="text-slate-500 mb-4 sm:mb-6 text-sm sm:text-base">
          Create your first sticky note to start organizing your thoughts and
          ideas.
        </p>
        <Button onClick={onCreateNote} size="lg" className="shadow-lg">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          Create First Note
        </Button>
      </div>
    </div>
  );
}
