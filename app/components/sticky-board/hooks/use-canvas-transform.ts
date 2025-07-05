import { useState, useRef, useCallback } from "react";
import {
  type CanvasTransform,
  type PanState,
  type TouchZoomState,
} from "../types";
import { MINIMUM_SCALE, MAXIMUM_SCALE } from "../constants";

export function useCanvasTransform() {
  const [canvasTransform, setCanvasTransform] = useState<CanvasTransform>({
    x: 0,
    y: 0,
    scale: 1,
  });

  const [panState, setPanState] = useState<PanState>({
    isPanning: false,
    panStart: { x: 0, y: 0 },
  });

  const canvasRef = useRef<HTMLDivElement>(null);
  const touchZoomRef = useRef<TouchZoomState>({
    initialDistance: 0,
    initialScale: 1,
  });

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number) => {
      return {
        x: (screenX - canvasTransform.x) / canvasTransform.scale,
        y: (screenY - canvasTransform.y) / canvasTransform.scale,
      };
    },
    [canvasTransform]
  );

  const zoomIn = useCallback(() => {
    setCanvasTransform((prev) => ({
      ...prev,
      scale: Math.min(MAXIMUM_SCALE, prev.scale + 0.2),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setCanvasTransform((prev) => ({
      ...prev,
      scale: Math.max(MINIMUM_SCALE, prev.scale - 0.2),
    }));
  }, []);

  const resetView = useCallback(() => {
    setCanvasTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  // Handle mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY * -0.001;
      const newScale = Math.max(
        MINIMUM_SCALE,
        Math.min(MAXIMUM_SCALE, canvasTransform.scale + delta)
      );

      // Zoom towards mouse position
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        setCanvasTransform((prev) => ({
          x: mouseX - (mouseX - prev.x) * (newScale / prev.scale),
          y: mouseY - (mouseY - prev.y) * (newScale / prev.scale),
          scale: newScale,
        }));
      }
    },
    [canvasTransform.scale]
  );

  // Canvas panning handlers
  const startPan = useCallback(
    (clientX: number, clientY: number) => {
      setPanState({
        isPanning: true,
        panStart: {
          x: clientX - canvasTransform.x,
          y: clientY - canvasTransform.y,
        },
      });
    },
    [canvasTransform]
  );

  const updatePan = useCallback(
    (clientX: number, clientY: number) => {
      if (panState.isPanning) {
        setCanvasTransform((prev) => ({
          ...prev,
          x: clientX - panState.panStart.x,
          y: clientY - panState.panStart.y,
        }));
      }
    },
    [panState]
  );

  const stopPan = useCallback(() => {
    setPanState((prev) => ({ ...prev, isPanning: false }));
  }, []);

  // Touch zoom handlers
  const startTouchZoom = useCallback(
    (distance: number) => {
      touchZoomRef.current = {
        initialDistance: distance,
        initialScale: canvasTransform.scale,
      };
    },
    [canvasTransform.scale]
  );

  const updateTouchZoom = useCallback((distance: number) => {
    const { initialDistance, initialScale } = touchZoomRef.current;
    const scale = Math.max(
      MINIMUM_SCALE,
      Math.min(MAXIMUM_SCALE, initialScale * (distance / initialDistance))
    );
    setCanvasTransform((prev) => ({ ...prev, scale }));
  }, []);

  return {
    canvasTransform,
    setCanvasTransform,
    panState,
    canvasRef,
    screenToCanvas,
    zoomIn,
    zoomOut,
    resetView,
    handleWheel,
    startPan,
    updatePan,
    stopPan,
    startTouchZoom,
    updateTouchZoom,
  };
}
