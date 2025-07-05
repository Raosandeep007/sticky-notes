import { useSharedState } from "@airstate/react";
import React, { useState } from "react";
import { StickyBoardHeader } from "./header";
import { type NoteTypes, Note, type NoteColor } from "./note";
import { EmptyState } from "./empty-state";

const colorPalette: NoteColor[] = [
  { name: "yellow", color: "#fef3c7", border: "#f59e0b" },
  { name: "pink", color: "#fce7f3", border: "#ec4899" },
  { name: "blue", color: "#dbeafe", border: "#3b82f6" },
  { name: "green", color: "#d1fae5", border: "#10b981" },
  { name: "purple", color: "#e9d5ff", border: "#8b5cf6" },
  { name: "orange", color: "#fed7aa", border: "#f97316" },
  { name: "indigo", color: "#e0e7ff", border: "#6366f1" },
  { name: "teal", color: "#ccfbf1", border: "#14b8a6" },
];

const getRandomColor = (): NoteColor => {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
};

export function StickyBoardApp() {
  const [notes, setNotes, isReady] = useSharedState<NoteTypes[]>([], {
    key: "sticky-board",
  });

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const createNote = () => {
    const colorScheme = getRandomColor();
    const newNote: NoteTypes = {
      id: crypto.randomUUID(),
      text: "",
      x: Math.max(
        10,
        Math.min(window.innerWidth - 280, 50 + Math.random() * 200)
      ),
      y: Math.max(
        80,
        Math.min(window.innerHeight - 250, 80 + Math.random() * 200)
      ),
      color: colorScheme,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setNotes([...(notes || []), newNote]);
  };

  const startDrag = (e: React.MouseEvent, note: NoteTypes) => {
    setDraggingId(note.id);
    const offsetX = e.clientX - note.x;
    const offsetY = e.clientY - note.y;
    setOffset({ x: offsetX, y: offsetY });
  };

  const onDrag = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const newX = Math.max(
      0,
      Math.min(window.innerWidth - 280, e.clientX - offset.x)
    );
    const newY = Math.max(
      60,
      Math.min(window.innerHeight - 250, e.clientY - offset.y)
    );

    setNotes(
      notes.map((n) => (n.id === draggingId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const stopDrag = () => setDraggingId(null);

  const updateText = (id: string, newText: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, text: newText } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const changeNoteColor = (id: string, newColor: NoteColor) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, color: newColor } : n)));
  };

  const removeAllNotes = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all notes? This action cannot be undone."
      )
    ) {
      setNotes([]);
    }
  };

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
        <div className="flex flex-wrap gap-2 sm:gap-4 mt-8 justify-center">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-pulse rounded-lg shadow-md"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-screen h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden touch-none"
      onMouseMove={onDrag}
      onMouseUp={stopDrag}
      onTouchMove={(e) => {
        if (draggingId && e.touches[0]) {
          const touch = e.touches[0];
          const newX = Math.max(
            0,
            Math.min(window.innerWidth - 280, touch.clientX - offset.x)
          );
          const newY = Math.max(
            60,
            Math.min(window.innerHeight - 250, touch.clientY - offset.y)
          );

          setNotes(
            notes.map((n) =>
              n.id === draggingId ? { ...n, x: newX, y: newY } : n
            )
          );
        }
      }}
      onTouchEnd={stopDrag}
    >
      <StickyBoardHeader
        notesCount={notes.length}
        onCreateNote={createNote}
        onClearAll={removeAllNotes}
      />

      {/* Notes */}
      {notes.map((note) => (
        <Note
          key={note.id}
          note={note}
          isDragging={draggingId === note.id}
          colorPalette={colorPalette}
          onMouseDown={startDrag}
          onUpdateText={updateText}
          onDelete={deleteNote}
          onChangeColor={changeNoteColor}
        />
      ))}

      {/* Empty State */}
      {notes.length === 0 && <EmptyState onCreateNote={createNote} />}
    </div>
  );
}
