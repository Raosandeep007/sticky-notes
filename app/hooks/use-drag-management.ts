import { useState, useCallback } from "react";
import { type DragState } from "~/components/sticky-board/types";
import { type NoteTypes } from "~/components/sticky-board/note";

interface UseDragManagementProps {
  updateNotePosition: (id: string, deltaX: number, deltaY: number) => void;
  canvasScale: number;
  startAutoPan?: (mouseX: number, mouseY: number) => void;
  updateAutoPan?: (mouseX: number, mouseY: number) => void;
  stopAutoPan?: () => void;
}

export function useDragManagement({
  updateNotePosition,
  canvasScale,
  startAutoPan,
  updateAutoPan,
  stopAutoPan,
}: UseDragManagementProps) {
  const [dragState, setDragState] = useState<DragState>({
    draggingId: null,
    offset: { x: 0, y: 0 },
  });

  const startDrag = useCallback(
    (e: React.MouseEvent, note: NoteTypes) => {
      e.stopPropagation();
      setDragState({
        draggingId: note.id,
        offset: {
          x: e.clientX,
          y: e.clientY,
        },
      });

      // Start auto-pan when dragging starts
      if (startAutoPan) {
        startAutoPan(e.clientX, e.clientY);
      }
    },
    [startAutoPan]
  );

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

        // Update auto-pan based on current mouse position
        if (updateAutoPan) {
          updateAutoPan(clientX, clientY);
        }
      }
    },
    [dragState, canvasScale, updateNotePosition, updateAutoPan]
  );

  const stopDrag = useCallback(() => {
    setDragState({
      draggingId: null,
      offset: { x: 0, y: 0 },
    });

    // Stop auto-pan when dragging stops
    if (stopAutoPan) {
      stopAutoPan();
    }
  }, [stopAutoPan]);

  return {
    dragState,
    startDrag,
    updateDrag,
    stopDrag,
  };
}
