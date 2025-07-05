import React from "react";
import { motion } from "framer-motion";
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
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      const touch = e.touches[0];
      const syntheticEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        stopPropagation: () => e.stopPropagation(),
      } as React.MouseEvent;
      onMouseDown(syntheticEvent, note);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -10 }}
      animate={{
        scale: isDragging ? 1.05 : 1,
        opacity: 1,
        rotate: isDragging ? 1 : 0,
        zIndex: isDragging ? 40 : "auto",
      }}
      exit={{ scale: 0, opacity: 0, rotate: 10 }}
      whileHover={{ scale: 1.02, rotate: 0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        opacity: { duration: 0.2 },
      }}
      onMouseDown={(e) => onMouseDown(e, note)}
      onTouchStart={handleTouchStart}
      data-note="true"
      className={cn(
        "absolute w-64 sm:w-72 min-h-48 sm:min-h-56 rounded-xl shadow-2xl group transition-shadow duration-200 ease-out font-bold",
        "border-2 hover:shadow-3xl cursor-move",
        isDragging && "shadow-4xl"
      )}
      style={{
        top: note.y,
        left: note.x,
        backgroundColor: note.color.color,
        borderColor: note.color.border,
      }}
    >
      {/* Note Header */}
      <div className="flex items-center justify-between p-2 sm:p-3 pb-0">
        <div className="flex items-center gap-1 sm:gap-2">
          <GripVertical className="size-4 sm:size-5 text-slate-400 cursor-move" />
          <div className="flex gap-0.5 sm:gap-1">
            {colorPalette.map((colorOption) => (
              <button
                key={colorOption.name}
                onClick={(e) => {
                  e.stopPropagation();
                  onChangeColor(note.id, colorOption);
                }}
                className={cn(
                  "size-3 sm:size-4 rounded-full border-2 border-white shadow-sm transition-transform hover:scale-125",
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
          className="h-5 w-5 sm:h-6 sm:w-6 hover:bg-red-100 hover:text-red-600 transition-colors cursor-pointer"
        >
          <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        </Button>
      </div>

      {/* Note Content */}
      <div className="p-2 sm:p-3 pt-1 sm:pt-2">
        <Textarea
          className="w-full min-h-30 sm:min-h-32 bg-transparent border-0 resize-none focus-visible:ring-0 text-slate-700 placeholder:text-slate-400 text-sm sm:text-base leading-relaxed font-bold touch-auto"
          value={note.text}
          placeholder="Write your thoughts..."
          onChange={(e) => onUpdateText(note.id, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
      </div>

      {/* Note Footer */}
      <div className="px-2 sm:px-3 pb-2 sm:pb-3">
        <div className="text-xs text-slate-500">
          {note.time} - {note.date}
        </div>
      </div>
    </motion.div>
  );
}
