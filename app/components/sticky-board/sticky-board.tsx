import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyBoardHeader } from "./header";
import { type NoteTypes } from "./note";
import { Note } from "./note";
import { EmptyState } from "./empty-state";
import { CanvasControls } from "./canvas-controls";
import { LoadingState } from "./loading-state";
import { colorPalette } from "./constants";

// Custom hooks
import { useCanvasTransform } from "./hooks/use-canvas-transform";
import { useNoteManagement } from "./hooks/use-note-management";
import { useDragManagement } from "./hooks/use-drag-management";
import { useEditingState } from "./hooks/use-editing-state";
import { useEventHandlers } from "./hooks/use-event-handlers";

export function StickyBoardApp() {
  // Custom hooks for different concerns
  const canvasHook = useCanvasTransform();
  const noteHook = useNoteManagement();
  const { isEditingNote } = useEditingState();

  const dragHook = useDragManagement({
    updateNotePosition: noteHook.updateNotePosition,
    canvasScale: canvasHook.canvasTransform.scale,
  });

  const eventHook = useEventHandlers({
    dragState: dragHook.dragState,
    panState: canvasHook.panState,
    isEditingNote,
    updateDrag: dragHook.updateDrag,
    stopDrag: dragHook.stopDrag,
    updatePan: canvasHook.updatePan,
    stopPan: canvasHook.stopPan,
    startPan: canvasHook.startPan,
    startTouchZoom: canvasHook.startTouchZoom,
    updateTouchZoom: canvasHook.updateTouchZoom,
    zoomIn: canvasHook.zoomIn,
    zoomOut: canvasHook.zoomOut,
    resetView: canvasHook.resetView,
    canvasRef: canvasHook.canvasRef,
  });

  // Handler functions
  const handleCreateNote = () => {
    const canvasCenter = canvasHook.screenToCanvas(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    noteHook.createNote(canvasCenter.x, canvasCenter.y);
  };

  const handleRemoveAllNotes = () => {
    if (noteHook.removeAllNotes()) {
      canvasHook.resetView();
    }
  };

  // Loading state
  if (!noteHook.isReady) {
    return <LoadingState />;
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden no-double-tap-zoom">
      <StickyBoardHeader
        notesCount={noteHook.notes.length}
        onCreateNote={handleCreateNote}
        onClearAll={handleRemoveAllNotes}
      />

      {/* Canvas Container */}
      <div
        ref={canvasHook.canvasRef}
        className="absolute inset-0 top-16 touch-none select-none cursor-grab active:cursor-grabbing no-double-tap-zoom"
        onMouseDown={eventHook.handleCanvasMouseDown}
        onTouchStart={eventHook.handleTouchStart}
        onWheel={canvasHook.handleWheel}
        style={{
          transform: `translate(${canvasHook.canvasTransform.x}px, ${canvasHook.canvasTransform.y}px) scale(${canvasHook.canvasTransform.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Notes */}
        <AnimatePresence>
          {noteHook.notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              isDragging={dragHook.dragState.draggingId === note.id}
              colorPalette={colorPalette}
              onMouseDown={dragHook.startDrag}
              onUpdateText={noteHook.updateText}
              onDelete={noteHook.deleteNote}
              onChangeColor={noteHook.changeNoteColor}
            />
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {noteHook.notes.length === 0 && (
          <div
            style={{
              position: "absolute",
              left:
                -canvasHook.canvasTransform.x /
                  canvasHook.canvasTransform.scale +
                window.innerWidth / 2,
              top:
                -canvasHook.canvasTransform.y /
                  canvasHook.canvasTransform.scale +
                window.innerHeight / 2,
            }}
          >
            <EmptyState onCreateNote={handleCreateNote} />
          </div>
        )}
      </div>

      {/* Canvas Controls */}
      <CanvasControls
        canvasScale={canvasHook.canvasTransform.scale}
        isEditingNote={isEditingNote}
        onZoomIn={canvasHook.zoomIn}
        onZoomOut={canvasHook.zoomOut}
        onResetView={canvasHook.resetView}
      />
    </div>
  );
}
