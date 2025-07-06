import { useRef, useCallback } from "react";

interface AutoPanState {
  isActive: boolean;
  direction: { x: number; y: number };
  animationId: number | null;
}

interface UseAutoPanProps {
  onUpdateTransform: (deltaX: number, deltaY: number) => void;
  panSpeed?: number;
  edgeThreshold?: number;
}

export function useAutoPan({
  onUpdateTransform,
  panSpeed = 5,
  edgeThreshold = 50,
}: UseAutoPanProps) {
  const autoPanRef = useRef<AutoPanState>({
    isActive: false,
    direction: { x: 0, y: 0 },
    animationId: null,
  });

  const startAutoPan = useCallback(
    (mouseX: number, mouseY: number) => {
      const state = autoPanRef.current;

      // Calculate pan direction based on mouse position relative to viewport edges
      let panX = 0;
      let panY = 0;

      // Check left edge
      if (mouseX < edgeThreshold) {
        panX =
          panSpeed * Math.max(0.1, (edgeThreshold - mouseX) / edgeThreshold);
      }
      // Check right edge
      else if (mouseX > window.innerWidth - edgeThreshold) {
        panX =
          -panSpeed *
          Math.max(
            0.1,
            (mouseX - (window.innerWidth - edgeThreshold)) / edgeThreshold
          );
      }

      // Check top edge
      if (mouseY < edgeThreshold + 64) {
        // Add header height offset
        panY =
          panSpeed *
          Math.max(0.1, (edgeThreshold + 64 - mouseY) / edgeThreshold);
      }
      // Check bottom edge
      else if (mouseY > window.innerHeight - edgeThreshold) {
        panY =
          -panSpeed *
          Math.max(
            0.1,
            (mouseY - (window.innerHeight - edgeThreshold)) / edgeThreshold
          );
      }

      // Only start auto-pan if there's movement needed
      if (panX !== 0 || panY !== 0) {
        state.direction = { x: panX, y: panY };

        if (!state.isActive) {
          state.isActive = true;

          const animate = () => {
            if (state.isActive) {
              onUpdateTransform(state.direction.x, state.direction.y);
              state.animationId = requestAnimationFrame(animate);
            }
          };

          state.animationId = requestAnimationFrame(animate);
        }
      } else {
        // Stop auto-pan if mouse is not near edges
        stopAutoPan();
      }
    },
    [onUpdateTransform, panSpeed, edgeThreshold]
  );

  const stopAutoPan = useCallback(() => {
    const state = autoPanRef.current;
    state.isActive = false;
    state.direction = { x: 0, y: 0 };

    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
      state.animationId = null;
    }
  }, []);

  const updateAutoPan = useCallback(
    (mouseX: number, mouseY: number) => {
      startAutoPan(mouseX, mouseY);
    },
    [startAutoPan]
  );

  return {
    startAutoPan,
    updateAutoPan,
    stopAutoPan,
  };
}
