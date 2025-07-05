import { useState, useRef, useCallback } from "react";
import {
  type CanvasTransform,
  type PanState,
  type TouchZoomState,
} from "../types";
import { MINIMUM_SCALE, MAXIMUM_SCALE } from "../constants";
import { useMomentumScroll } from "./use-momentum-scroll";
import { useAutoPan } from "./use-auto-pan";

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

  // Momentum scrolling for smooth panning
  const panTrackingRef = useRef({
    lastX: 0,
    lastY: 0,
    lastTime: 0,
  });

  const momentum = useMomentumScroll({
    onUpdateTransform: (deltaX: number, deltaY: number) => {
      setCanvasTransform((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    },
  });

  // Auto-panning when dragging near edges
  const autoPan = useAutoPan({
    onUpdateTransform: (deltaX: number, deltaY: number) => {
      setCanvasTransform((prev) => ({
        ...prev,
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));
    },
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

  const setZoom = useCallback((scale: number) => {
    setCanvasTransform((prev) => ({
      ...prev,
      scale: Math.max(MINIMUM_SCALE, Math.min(MAXIMUM_SCALE, scale)),
    }));
  }, []);

  const resetView = useCallback(() => {
    setCanvasTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  // Handle mouse wheel zoom and pan
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      momentum.stopMomentum();

      if (e.shiftKey) {
        // Shift + wheel = horizontal pan (Figma-like)
        const deltaX = e.deltaY * 0.5;
        setCanvasTransform((prev) => ({
          ...prev,
          x: prev.x - deltaX,
        }));
      } else if (e.ctrlKey || e.metaKey) {
        // Ctrl/Cmd + wheel = zoom (for systems that use this pattern)
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
      } else {
        // Regular wheel = zoom (default)
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
      }
    },
    [canvasTransform.scale, momentum]
  );

  // Canvas panning handlers
  const startPan = useCallback(
    (clientX: number, clientY: number) => {
      momentum.stopMomentum();

      setPanState({
        isPanning: true,
        panStart: {
          x: clientX - canvasTransform.x,
          y: clientY - canvasTransform.y,
        },
      });

      // Initialize tracking for momentum
      panTrackingRef.current = {
        lastX: clientX,
        lastY: clientY,
        lastTime: Date.now(),
      };
    },
    [canvasTransform, momentum]
  );

  const updatePan = useCallback(
    (clientX: number, clientY: number) => {
      if (panState.isPanning) {
        const newX = clientX - panState.panStart.x;
        const newY = clientY - panState.panStart.y;

        setCanvasTransform((prev) => ({
          ...prev,
          x: newX,
          y: newY,
        }));

        // Update tracking for momentum
        panTrackingRef.current = {
          lastX: clientX,
          lastY: clientY,
          lastTime: Date.now(),
        };
      }
    },
    [panState]
  );

  const stopPan = useCallback(() => {
    if (panState.isPanning) {
      // Calculate momentum from last movement
      const now = Date.now();
      const deltaTime = now - panTrackingRef.current.lastTime;

      if (deltaTime > 0 && deltaTime < 100) {
        // Only apply momentum if recent movement
        const currentPos = canvasTransform;
        const expectedX = panTrackingRef.current.lastX - panState.panStart.x;
        const expectedY = panTrackingRef.current.lastY - panState.panStart.y;

        const deltaX = expectedX - currentPos.x;
        const deltaY = expectedY - currentPos.y;

        momentum.startMomentum(deltaX, deltaY, deltaTime);
      }
    }

    setPanState((prev) => ({ ...prev, isPanning: false }));
  }, [panState, canvasTransform, momentum]);

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

  // Navigate to specific canvas coordinates
  const navigateTo = useCallback((x: number, y: number) => {
    setCanvasTransform((prev) => ({
      ...prev,
      x,
      y,
    }));
  }, []);

  return {
    canvasTransform,
    setCanvasTransform,
    panState,
    canvasRef,
    screenToCanvas,
    zoomIn,
    zoomOut,
    setZoom,
    resetView,
    handleWheel,
    startPan,
    updatePan,
    stopPan,
    startTouchZoom,
    updateTouchZoom,
    navigateTo,
    startAutoPan: autoPan.startAutoPan,
    updateAutoPan: autoPan.updateAutoPan,
    stopAutoPan: autoPan.stopAutoPan,
  };
}
