import { useSharedState } from "@airstate/react";
import { type NoteTypes, type NoteColor } from "../note";
import { getRandomColor } from "../constants";
import { useCanvasManagement } from "./use-canvas-management";
import { useEffect, useState, useRef } from "react";

export function useNoteManagement(userId: string = "default-user") {
  const canvasManager = useCanvasManagement(userId);

  // Create a reactive key that updates when canvas or user changes
  const notesKey = canvasManager.activeCanvasId
    ? `canvas-notes-${canvasManager.activeCanvasId}-${userId}`
    : `temp-notes-${userId}`;

  // Get notes for the current active canvas using canvas-specific storage key
  const [notes, setNotes, isNotesReady] = useSharedState<NoteTypes[]>([], {
    key: notesKey,
  });

  console.dir({
    "notes:": notes?.length || 0,
    "notes data:": notes?.map((n) => ({
      id: n.id,
      text: n.text?.substring(0, 20) + (n.text?.length > 20 ? "..." : ""),
      userId: n.userId,
      canvasId: n.canvasId,
      storageKey: n.storageKey,
    })),
    "activeCanvasId:": canvasManager.activeCanvasId,
    "userId:": userId,
    "notesKey:": notesKey,
  });

  const isReady = canvasManager.isReady && isNotesReady;

  // Migrate existing notes to include user and canvas info
  useEffect(() => {
    if (isReady && notes && canvasManager.activeCanvasId) {
      const needsMigration = notes.some(
        (note) => !note.userId || !note.canvasId || !note.storageKey
      );
      if (needsMigration) {
        console.log(
          "Migrating notes to include user, canvas, and storage key info"
        );
        const migratedNotes = notes.map((note) => ({
          ...note,
          userId: note.userId || userId,
          canvasId: note.canvasId || canvasManager.activeCanvasId || "unknown",
          storageKey: note.storageKey || notesKey,
        }));
        setNotes(migratedNotes);
      }
    }
  }, [isReady, notes, canvasManager.activeCanvasId, userId, notesKey]);

  // Initialize default canvas if needed
  useEffect(() => {
    if (canvasManager.isReady) {
      canvasManager.initializeDefaultCanvas();
    }
  }, [canvasManager.isReady]);

  // Update notes count in canvas metadata when notes change
  useEffect(() => {
    if (canvasManager.activeCanvasId && notes && canvasManager.isReady) {
      canvasManager.updateCanvasNotesCount(
        canvasManager.activeCanvasId,
        notes.length
      );
    }
  }, [notes?.length, canvasManager.activeCanvasId, canvasManager.isReady]);

  // Debug key changes
  useEffect(() => {
    console.log("=== Notes key changed ===");
    console.log("New key:", notesKey);
    console.log("Active canvas:", canvasManager.activeCanvasId);
    console.log("User ID:", userId);
    console.log("Notes count:", notes?.length || 0);
    console.log("========================");
  }, [notesKey, canvasManager.activeCanvasId, userId]);

  // Force refresh when key changes (handle useSharedState key switching)
  const [, forceRefresh] = useState(0);
  const prevNotesKeyRef = useRef(notesKey);

  useEffect(() => {
    if (prevNotesKeyRef.current !== notesKey) {
      console.log(
        "Notes key changed, forcing refresh:",
        prevNotesKeyRef.current,
        "->",
        notesKey
      );
      prevNotesKeyRef.current = notesKey;
      // Force a re-render to ensure useSharedState picks up the new key
      forceRefresh((prev) => prev + 1);
    }
  }, [notesKey]);

  const createNote = (x: number, y: number, color?: NoteColor) => {
    console.log("Creating note for canvas:", canvasManager.activeCanvasId);
    if (!canvasManager.activeCanvasId) {
      console.warn("Cannot create note: no active canvas");
      return;
    }

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
      userId: userId,
      canvasId: canvasManager.activeCanvasId,
      storageKey: notesKey,
    };
    console.log("Creating note:", newNote);
    setNotes([...notes, newNote]);
  };

  const updateText = (id: string, newText: string) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? {
              ...n,
              text: newText,
              storageKey: n.storageKey || notesKey, // Ensure storageKey is maintained
            }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const changeNoteColor = (id: string, newColor: NoteColor) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? {
              ...n,
              color: newColor,
              storageKey: n.storageKey || notesKey, // Ensure storageKey is maintained
            }
          : n
      )
    );
  };

  const updateNotePosition = (id: string, deltaX: number, deltaY: number) => {
    setNotes(
      notes.map((n) =>
        n.id === id
          ? {
              ...n,
              x: n.x + deltaX,
              y: n.y + deltaY,
              storageKey: n.storageKey || notesKey, // Ensure storageKey is maintained
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
    // Expose canvas management functionality
    canvasManager,
  };
}
