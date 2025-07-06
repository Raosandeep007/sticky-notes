import { useEffect, useCallback } from "react";
import {
  DOUBLE_TAP_THRESHOLD,
  ZOOM_STEP,
  MINIMUM_SCALE,
  MAXIMUM_SCALE,
} from "~/components/sticky-board/constants";

interface UseEventHandlersProps {
  dragState: { draggingId: string | null };
  panState: { isPanning: boolean };
  isEditingNote: boolean;
  updateDrag: (clientX: number, clientY: number) => void;
  stopDrag: () => void;
  updatePan: (clientX: number, clientY: number) => void;
  stopPan: () => void;
  startPan: (clientX: number, clientY: number) => void;
  startTouchZoom: (
    distance: number,
    centerX?: number,
    centerY?: number
  ) => void;
  updateTouchZoom: (
    distance: number,
    centerX?: number,
    centerY?: number
  ) => void;
  setZoom: (scale: number) => void;
  canvasTransform: { scale: number; x: number; y: number };
  resetView: () => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  navigateTo: (x: number, y: number) => void;
  setCanvasTransform: (transform: any) => void;
}

export function useEventHandlers({
  dragState,
  panState,
  isEditingNote,
  updateDrag,
  stopDrag,
  updatePan,
  stopPan,
  startPan,
  startTouchZoom,
  updateTouchZoom,
  setZoom,
  canvasTransform,
  resetView,
  canvasRef,
  setCanvasTransform,
}: UseEventHandlersProps) {
  // Global mouse events for dragging and panning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      updateDrag(e.clientX, e.clientY);
      updatePan(e.clientX, e.clientY);
    };

    const handleGlobalMouseUp = () => {
      stopDrag();
      stopPan();
    };

    if (dragState.draggingId || panState.isPanning) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [
    dragState.draggingId,
    panState.isPanning,
    updateDrag,
    updatePan,
    stopDrag,
    stopPan,
  ]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        // Check if touch is on an interactive element
        const target = e.target as HTMLElement;
        const isInteractiveElement =
          target.tagName === "BUTTON" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.closest("button") ||
          target.closest("textarea") ||
          target.closest("[data-note]");

        if (!isInteractiveElement) {
          startPan(e.touches[0].clientX, e.touches[0].clientY);
        }
      } else if (e.touches.length === 2) {
        // Pinch to zoom - prevent browser's default pinch behavior
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        startTouchZoom(distance, centerX, centerY);
        stopPan(); // Stop any ongoing pan when starting pinch
      }
    },
    [startPan, startTouchZoom, stopPan]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch zoom - always prevent default to avoid browser zoom
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const centerX = (touch1.clientX + touch2.clientX) / 2;
        const centerY = (touch1.clientY + touch2.clientY) / 2;
        updateTouchZoom(distance, centerX, centerY);
      } else if (
        e.touches.length === 1 &&
        panState.isPanning &&
        !dragState.draggingId
      ) {
        // Only prevent default for panning if we're actually panning
        e.preventDefault();
        updatePan(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    [panState.isPanning, dragState.draggingId, updatePan, updateTouchZoom]
  );

  const handleTouchDrag = useCallback(
    (e: React.TouchEvent) => {
      if (dragState.draggingId && e.touches[0] && !panState.isPanning) {
        const touch = e.touches[0];
        updateDrag(touch.clientX, touch.clientY);
      }
    },
    [dragState.draggingId, panState.isPanning, updateDrag]
  );

  // Global touch events for mobile
  useEffect(() => {
    const handleGlobalTouchMove = (e: TouchEvent) => {
      // For pinch zoom (2 fingers), always prevent default to avoid browser zoom
      if (e.touches.length === 2) {
        e.preventDefault();
        handleTouchMove(e as any);
        return;
      }

      // For single touch, only prevent default if we're panning or dragging
      if (panState.isPanning || dragState.draggingId) {
        e.preventDefault();
      }

      handleTouchDrag(e as any);
      handleTouchMove(e as any);
    };

    const handleGlobalTouchEnd = () => {
      stopDrag();
      stopPan();
    };

    const handleGlobalTouchStart = (e: TouchEvent) => {
      // For multi-touch gestures (pinch zoom), ensure we handle them
      if (e.touches.length === 2) {
        e.preventDefault(); // Prevent browser's pinch zoom
      }
    };

    if (dragState.draggingId || panState.isPanning) {
      // Use passive: false for touchmove to allow preventDefault
      document.addEventListener("touchmove", handleGlobalTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleGlobalTouchEnd, {
        passive: true,
      });
    }

    // Always listen for touch start to handle pinch gestures
    document.addEventListener("touchstart", handleGlobalTouchStart, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
      document.removeEventListener("touchstart", handleGlobalTouchStart);
    };
  }, [
    dragState.draggingId,
    panState.isPanning,
    handleTouchDrag,
    handleTouchMove,
    stopDrag,
    stopPan,
  ]);

  // Keyboard shortcuts for canvas controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger canvas shortcuts if user is typing in a textarea or input
      const activeElement = document.activeElement as HTMLElement;
      const isInputFocused =
        activeElement?.tagName === "TEXTAREA" ||
        activeElement?.tagName === "INPUT" ||
        activeElement?.contentEditable === "true";

      if (isInputFocused) return;

      // Zoom in with + or =
      if ((e.key === "+" || e.key === "=") && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const newScale = Math.min(
          MAXIMUM_SCALE,
          canvasTransform.scale + ZOOM_STEP
        );
        setZoom(newScale);
      }
      // Zoom out with -
      else if (e.key === "-" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const newScale = Math.max(
          MINIMUM_SCALE,
          canvasTransform.scale - ZOOM_STEP
        );
        setZoom(newScale);
      }
      // Reset view with R (only when no modifiers are pressed)
      else if (
        (e.key === "r" || e.key === "R") &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        resetView();
      }
      // Arrow keys for panning (Figma-like) - only when no modifiers are pressed
      else if (
        e.key === "ArrowUp" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setCanvasTransform((prev: any) => ({ ...prev, y: prev.y + 50 }));
      } else if (
        e.key === "ArrowDown" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setCanvasTransform((prev: any) => ({ ...prev, y: prev.y - 50 }));
      } else if (
        e.key === "ArrowLeft" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setCanvasTransform((prev: any) => ({ ...prev, x: prev.x + 50 }));
      } else if (
        e.key === "ArrowRight" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey &&
        !e.altKey
      ) {
        e.preventDefault();
        setCanvasTransform((prev: any) => ({ ...prev, x: prev.x - 50 }));
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setZoom, canvasTransform.scale, resetView, setCanvasTransform]);

  // Prevent double-tap zoom
  useEffect(() => {
    let lastTouchEnd = 0;

    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= DOUBLE_TAP_THRESHOLD) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // Handle canvas mouse down
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Allow panning on the canvas or its direct children, but not on interactive elements
      const target = e.target as HTMLElement;
      const isInteractiveElement =
        target.tagName === "BUTTON" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "INPUT" ||
        target.closest("button") ||
        target.closest("textarea") ||
        target.closest("[data-note]"); // Use data attribute to mark note areas

      if (!isInteractiveElement) {
        startPan(e.clientX, e.clientY);
      }
    },
    [startPan]
  );

  return {
    handleCanvasMouseDown,
    handleTouchStart,
    handleTouchMove,
  };
}
