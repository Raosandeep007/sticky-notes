import { useSharedState } from "@airstate/react";
import { useEffect } from "react";

export interface Canvas {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  notesCount: number; // Track count without storing actual notes
  storageKey: string; // Track which storage key this canvas belongs to
  [key: string]: any; // Index signature for useSharedState compatibility
}

export function useCanvasManagement(userId: string = "default-user") {
  // Store list of all canvases for this user (like a "canvas_list" table)
  const [canvases, setCanvases, isCanvasesReady] = useSharedState<Canvas[]>(
    [],
    {
      key: `canvas-list-${userId}`,
    }
  );

  // Store current active canvas ID for this user
  const [activeCanvasId, setActiveCanvasId, isActiveCanvasReady] =
    useSharedState<string | null>(null, {
      key: `active-canvas-${userId}`,
    });

  console.log(
    "canvases:",
    canvases?.length || 0,
    "canvases data:",
    canvases?.map((c) => ({
      id: c.id,
      name: c.name,
      userId: c.userId,
      storageKey: c.storageKey,
    })),
    "userId:",
    userId,
    "activeCanvasId:",
    activeCanvasId
  );

  const isReady = isCanvasesReady && isActiveCanvasReady;

  // Get current active canvas
  const activeCanvas =
    canvases.find((canvas) => canvas.id === activeCanvasId) || null;

  // Create a new canvas
  const createCanvas = (name?: string) => {
    const canvasListKey = `canvas-list-${userId}`;
    const newCanvas: Canvas = {
      id: crypto.randomUUID(),
      name: name || `Canvas ${canvases.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: userId,
      notesCount: 0,
      storageKey: canvasListKey,
    };

    console.log("Creating canvas:", newCanvas);
    setCanvases([...canvases, newCanvas]);
    setActiveCanvasId(newCanvas.id);
    return newCanvas;
  };

  // Switch to a different canvas
  const switchToCanvas = (canvasId: string) => {
    console.log("Switching to canvas:", canvasId);
    const canvas = canvases.find((c) => c.id === canvasId);
    if (canvas) {
      setActiveCanvasId(canvasId);
      console.log("Switched to canvas:", canvas);
      return canvas;
    }
    console.warn("Canvas not found:", canvasId);
    return null;
  };

  // Update canvas name
  const updateCanvasName = (canvasId: string, newName: string) => {
    setCanvases(
      canvases.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              name: newName,
              updatedAt: new Date().toISOString(),
              storageKey: canvas.storageKey || `canvas-list-${userId}`, // Ensure storageKey is maintained
            }
          : canvas
      )
    );
  };

  // Delete a canvas
  const deleteCanvas = (canvasId: string) => {
    console.log("Deleting canvas:", canvasId);
    if (canvases.length <= 1) {
      console.warn("Cannot delete last canvas");
      // Don't delete the last canvas
      return false;
    }

    const updatedCanvases = canvases.filter((canvas) => canvas.id !== canvasId);
    setCanvases(updatedCanvases);
    console.log("Canvas deleted, remaining canvases:", updatedCanvases);

    // If we deleted the active canvas, switch to the first available one
    if (activeCanvasId === canvasId && updatedCanvases.length > 0) {
      console.log("Switching to new active canvas:", updatedCanvases[0].id);
      setActiveCanvasId(updatedCanvases[0].id);
    }

    return true;
  };

  // Update notes count for a canvas (called when notes are added/removed)
  const updateCanvasNotesCount = (canvasId: string, notesCount: number) => {
    setCanvases(
      canvases.map((canvas) =>
        canvas.id === canvasId
          ? {
              ...canvas,
              notesCount,
              updatedAt: new Date().toISOString(),
              storageKey: canvas.storageKey || `canvas-list-${userId}`, // Ensure storageKey is maintained
            }
          : canvas
      )
    );
  };

  // Initialize with default canvas if none exist
  const initializeDefaultCanvas = () => {
    console.log("=== Initializing default canvas ===");
    console.log(
      "isReady:",
      isReady,
      "canvases.length:",
      canvases.length,
      "activeCanvasId:",
      activeCanvasId
    );

    if (isReady && canvases.length === 0) {
      console.log("Creating first canvas for user:", userId);
      const defaultCanvas = createCanvas("My First Canvas");
      return defaultCanvas;
    }

    // If canvases exist but no active canvas is set, set the first one as active
    if (isReady && canvases.length > 0 && !activeCanvasId) {
      console.log("Setting first canvas as active:", canvases[0].id);
      setActiveCanvasId(canvases[0].id);
      return canvases[0];
    }

    console.log(
      "Canvas initialization complete. Active canvas:",
      activeCanvas?.name
    );
    return activeCanvas;
  };

  // Migrate existing canvases to include storage key
  useEffect(() => {
    if (isReady && canvases.length > 0) {
      const needsMigration = canvases.some((canvas) => !canvas.storageKey);
      if (needsMigration) {
        console.log("Migrating canvases to include storage key info");
        const canvasListKey = `canvas-list-${userId}`;
        const migratedCanvases = canvases.map((canvas) => ({
          ...canvas,
          storageKey: canvas.storageKey || canvasListKey,
        }));
        setCanvases(migratedCanvases);
      }
    }
  }, [isReady, canvases, userId]);

  return {
    canvases,
    activeCanvas,
    activeCanvasId,
    isReady,
    userId,
    createCanvas,
    switchToCanvas,
    updateCanvasName,
    deleteCanvas,
    updateCanvasNotesCount,
    initializeDefaultCanvas,
  };
}
