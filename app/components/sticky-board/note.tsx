import React from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "~/lib/utils";

export type NoteColor = {
  name: string;
  color: string;
  border: string;
};

export type NoteTypes = {
  id: string;
  text: string;
  x: number;
  y: number;
  color: NoteColor;
  date: string;
  time: string;
};

interface NoteProps {
  note: NoteTypes;
  isDragging: boolean;
  colorPalette: NoteColor[];
  onMouseDown: (e: React.MouseEvent, note: NoteTypes) => void;
  onUpdateText: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onChangeColor: (id: string, color: NoteColor) => void;
}

export function Note({
  note,
  isDragging,
  colorPalette,
  onMouseDown,
  onUpdateText,
  onDelete,
  onChangeColor,
}: NoteProps) {
  return (
    <div
      className={cn(
        "absolute w-72 min-h-56 rounded-xl shadow-2xl group transition-all duration-200 ease-out font-bold",
        "border-2 hover:shadow-3xl",
        {
          "cursor-move": isDragging,
          "scale-105 rotate-1 z-40": isDragging,
          //   "hover:scale-102": !isDragging,
        }
      )}
      style={{
        top: note.y,
        left: note.x,
        backgroundColor: note.color.color,
        borderColor: note.color.border,
      }}
    >
      {/* Note Header */}
      <div className="flex items-center justify-between p-3 pb-0">
        <div className="flex items-center gap-2">
          <GripVertical
            className="w-4 h-4 text-slate-400 cursor-move"
            onMouseDown={(e) => onMouseDown(e, note)}
          />
          <div className="flex gap-1">
            {colorPalette.map((colorOption) => (
              <button
                key={colorOption.name}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeColor(note.id, colorOption);
                }}
                className={cn(
                  "w-3 h-3 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-125",
                  note.color.name === colorOption.name &&
                    "ring-2 ring-slate-400"
                )}
                style={{ backgroundColor: colorOption.color }}
              />
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="h-6 w-6 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Note Content */}
      <div className="p-3 pt-2">
        <Textarea
          className="w-full min-h-32 bg-transparent border-0 resize-none focus-visible:ring-0 text-slate-700 placeholder:text-slate-400 text-base leading-relaxed font-bold"
          value={note.text}
          placeholder="Write your thoughts..."
          onChange={(e) => onUpdateText(note.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Note Footer */}
      <div className="px-3 pb-3">
        <div className="text-xs text-slate-500">
          {note.time} - {note.date}
        </div>
      </div>
    </div>
  );
}
