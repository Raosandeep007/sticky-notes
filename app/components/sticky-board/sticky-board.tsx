import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CanvasControls } from "./canvas-controls";
import { colorPalette } from "./constants";
import { EmptyState } from "./empty-state";
import { StickyBoardHeader } from "./header";
import { InfiniteGrid } from "./infinite-grid";
import { LoadingState } from "./loading-state";
import { MiniMap } from "./mini-map";
import { Note, type NoteTypes } from "./note";
import { NotesListPage } from "./notes-list-page";
import { SettingsPage } from "./settings-page";

// Custom hooks
import { useCanvasTransform } from "~/hooks/use-canvas-transform";
import { useDragManagement } from "~/hooks/use-drag-management";
import { useEditingState } from "~/hooks/use-editing-state";
import { useEventHandlers } from "~/hooks/use-event-handlers";
import { useSettings } from "~/hooks/use-settings";
import { useNoteManagement } from "~/hooks/use-note-management";

export function StickyBoardApp({ boardId }: { boardId: string }) {
  // Settings and UI state
  const settings = useSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotesListOpen, setIsNotesListOpen] = useState(false);

  // Custom hooks for different concerns
  const canvasHook = useCanvasTransform();
  const noteHook = useNoteManagement({ id: boardId });
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

  const handleNavigateToNote = (note: NoteTypes) => {
    // Calculate the position to center the note on screen
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    // Account for note size (approximately 288px wide x 224px tall based on CSS)
    const noteWidth = 288;
    const noteHeight = 224;

    // Set zoom to 100% (scale = 1) and center the note
    const targetX = screenCenterX - (note.x + noteWidth / 2);
    const targetY = screenCenterY - (note.y + noteHeight / 2);

    canvasHook.setCanvasTransform({
      x: targetX,
      y: targetY,
      scale: 1,
    });

    // Focus on the note's textarea after a short delay to allow animation
    setTimeout(() => {
      const noteElement = document.querySelector(
        `[data-note-id="${note.id}"] textarea`
      );
      if (noteElement) {
        (noteElement as HTMLTextAreaElement).focus();
      }
    }, 300);
  };

  // Loading state
  if (!noteHook.isReady) {
    return <LoadingState />;
  }

  return (
    <>
      <div
        className="w-screen h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={eventHook.handleCanvasMouseDown}
        onTouchStart={eventHook.handleTouchStart}
        onTouchMove={eventHook.handleTouchMove}
        onWheel={canvasHook.handleWheel}
        style={{
          touchAction: "pan-x pan-y pinch-zoom", // Allow pan and pinch zoom, prevent double-tap
        }}
      >
        <div className="pointer-events-auto">
          <StickyBoardHeader
            notesCount={noteHook.notes.length}
            onCreateNote={handleCreateNote}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenNotesList={() => setIsNotesListOpen(true)}
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
      </div>
      {/* Settings Page */}
      <SettingsPage
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Notes List Page */}
      <NotesListPage
        isOpen={isNotesListOpen}
        onClose={() => setIsNotesListOpen(false)}
        notes={noteHook.notes}
        onNavigateToNote={handleNavigateToNote}
        onClearAll={handleRemoveAllNotes}
      />
    </>
  );
}
