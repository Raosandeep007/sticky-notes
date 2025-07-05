import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StickyBoardHeader } from "./header";
import { type NoteTypes } from "./note";
import { Note } from "./note";
import { EmptyState } from "./empty-state";
import { CanvasControls } from "./canvas-controls";
import { LoadingState } from "./loading-state";
import { InfiniteGrid } from "./infinite-grid";
import { MiniMap } from "./mini-map";
import { SettingsPage } from "./settings-page";
import { colorPalette } from "./constants";

// Custom hooks
import { useCanvasTransform } from "./hooks/use-canvas-transform";
import { useNoteManagement } from "./hooks/use-note-management";
import { useDragManagement } from "./hooks/use-drag-management";
import { useEditingState } from "./hooks/use-editing-state";
import { useEventHandlers } from "./hooks/use-event-handlers";
import { useSettings } from "./hooks/use-settings";

export function StickyBoardApp() {
  // Settings and UI state
  const settings = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Custom hooks for different concerns
  const canvasHook = useCanvasTransform();
  const noteHook = useNoteManagement();
  const { isEditingNote } = useEditingState();

  const dragHook = useDragManagement({
    updateNotePosition: noteHook.updateNotePosition,
    canvasScale: canvasHook.canvasTransform.scale,
    startAutoPan: canvasHook.startAutoPan,
    updateAutoPan: canvasHook.updateAutoPan,
    stopAutoPan: canvasHook.stopAutoPan,
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
    setZoom: canvasHook.setZoom,
    canvasTransform: canvasHook.canvasTransform,
    resetView: canvasHook.resetView,
    canvasRef: canvasHook.canvasRef,
    navigateTo: canvasHook.navigateTo,
    setCanvasTransform: canvasHook.setCanvasTransform,
  });

  // Handler functions
  const handleCreateNote = () => {
    const canvasCenter = canvasHook.screenToCanvas(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    // Use default color only if the setting is enabled, otherwise use random color
    const color = settings.useDefaultColor
      ? settings.defaultNoteColor
      : undefined;
    noteHook.createNote(canvasCenter.x, canvasCenter.y, color);
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
    <div
      className="w-screen h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden no-double-tap-zoom cursor-grab active:cursor-grabbing"
      onMouseDown={eventHook.handleCanvasMouseDown}
      onTouchStart={eventHook.handleTouchStart}
      onWheel={canvasHook.handleWheel}
      style={{
        touchAction: "none", // Prevent default touch actions for the entire page
      }}
    >
      <div className="pointer-events-auto">
        <StickyBoardHeader
          notesCount={noteHook.notes.length}
          onCreateNote={handleCreateNote}
          onClearAll={handleRemoveAllNotes}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Infinite Grid Background */}
      {settings.showGrid && (
        <InfiniteGrid canvasTransform={canvasHook.canvasTransform} />
      )}

      {/* Canvas Container */}
      <div
        ref={canvasHook.canvasRef}
        className="absolute inset-0 top-16 select-none pointer-events-none"
        style={{
          transform: `translate(${canvasHook.canvasTransform.x}px, ${canvasHook.canvasTransform.y}px) scale(${canvasHook.canvasTransform.scale})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Notes */}
        <div className="pointer-events-auto">
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
        </div>

        {/* Empty State */}
        {noteHook.notes.length === 0 && (
          <div
            className="pointer-events-auto"
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
      <div className="pointer-events-auto">
        <CanvasControls
          canvasScale={canvasHook.canvasTransform.scale}
          isEditingNote={isEditingNote}
          onSetZoom={canvasHook.setZoom}
          onResetView={canvasHook.resetView}
        />
      </div>

      {/* Mini Map */}
      {settings.showMiniMap && (
        <div className="pointer-events-auto">
          <MiniMap
            canvasTransform={canvasHook.canvasTransform}
            notes={noteHook.notes}
            onNavigate={canvasHook.navigateTo}
          />
        </div>
      )}

      {/* Settings Page */}
      <SettingsPage
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
