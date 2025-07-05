import { useSharedState } from "@airstate/react";
import { type NoteTypes, type NoteColor } from "../note";
import { getRandomColor } from "../constants";

export function useNoteManagement() {
  const [notes, setNotes, isReady] = useSharedState<NoteTypes[]>([], {
    key: "sticky-board-3",
  });

  const createNote = (x: number, y: number, color?: NoteColor) => {
    const colorScheme = color || getRandomColor();
    const newNote: NoteTypes = {
      id: crypto.randomUUID(),
      text: "",
      x: x - 140 + Math.random() * 100, // Center with some randomness
      y: y - 100 + Math.random() * 100,
      color: colorScheme,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setNotes([...(notes || []), newNote]);
  };

  const updateText = (id: string, newText: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, text: newText } : n)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const changeNoteColor = (id: string, newColor: NoteColor) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, color: newColor } : n)));
  };

  const updateNotePosition = (id: string, deltaX: number, deltaY: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) =>
        n.id === id
          ? {
              ...n,
              x: n.x + deltaX,
              y: n.y + deltaY,
            }
          : n
      )
    );
  };

  const removeAllNotes = () => {
    if (
      window.confirm(
        "Are you sure you want to remove all notes? This action cannot be undone."
      )
    ) {
      setNotes([]);
      return true;
    }
    return false;
  };

  return {
    notes,
    isReady,
    createNote,
    updateText,
    deleteNote,
    changeNoteColor,
    updateNotePosition,
    removeAllNotes,
  };
}
