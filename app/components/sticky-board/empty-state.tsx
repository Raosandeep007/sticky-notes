import React from "react";
import { Button } from "~/components/ui/button";
import { Plus, Palette } from "lucide-react";

interface EmptyStateProps {
  onCreateNote: () => void;
}

export function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Palette className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">
          Your canvas awaits
        </h2>
        <p className="text-slate-500 mb-6 max-w-md">
          Create your first sticky note to start organizing your thoughts and
          ideas.
        </p>
        <Button onClick={onCreateNote} size="lg" className="shadow-lg">
          <Plus className="w-5 h-5" />
          Create First Note
        </Button>
      </div>
    </div>
  );
}
