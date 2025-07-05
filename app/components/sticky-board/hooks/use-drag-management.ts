import { useState, useCallback } from "react";
import { type DragState } from "../types";
import { type NoteTypes } from "../note";

interface UseDragManagementProps {
  updateNotePosition: (id: string, deltaX: number, deltaY: number) => void;
  canvasScale: number;
}

export function useDragManagement({
  updateNotePosition,
  canvasScale,
}: UseDragManagementProps) {
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    offset: { x: 0, y: 0 },
  });

  const startDrag = useCallback((e: React.MouseEvent, note: NoteTypes) => {
    e.stopPropagation();
    setDragState({
      draggingId: note.id,
      offset: {
        x: e.clientX,
        y: e.clientY,
      },
    });
  }, []);

  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (dragState.draggingId) {
        const deltaX = (clientX - dragState.offset.x) / canvasScale;
        const deltaY = (clientY - dragState.offset.y) / canvasScale;

        updateNotePosition(dragState.draggingId, deltaX, deltaY);

        setDragState((prev) => ({
          ...prev,
          offset: { x: clientX, y: clientY },
        }));
      }
    },
    [dragState, canvasScale, updateNotePosition]
  );

  const stopDrag = useCallback(() => {
    setDragState({
      draggingId: null,
      offset: { x: 0, y: 0 },
    });
  }, []);

  return {
    dragState,
    startDrag,
    updateDrag,
    stopDrag,
  };
}
