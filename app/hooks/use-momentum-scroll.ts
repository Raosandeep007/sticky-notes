import { useRef, useCallback } from "react";

interface MomentumState {
  velocity: { x: number; y: number };
  lastUpdate: number;
  isDecelerating: boolean;
}

interface UseMomentumScrollProps {
  onUpdateTransform: (x: number, y: number) => void;
  friction?: number;
  threshold?: number;
}

export function useMomentumScroll({
  onUpdateTransform,
  friction = 0.92,
  threshold = 0.1,
}: UseMomentumScrollProps) {
  const momentumRef = useRef<MomentumState>({
    velocity: { x: 0, y: 0 },
    lastUpdate: 0,
    isDecelerating: false,
  });
  const animationRef = useRef<number | null>(null);

  const startMomentum = useCallback(
    (deltaX: number, deltaY: number, deltaTime: number) => {
      if (deltaTime > 0) {
        const state = momentumRef.current;
        state.velocity.x = deltaX / deltaTime;
        state.velocity.y = deltaY / deltaTime;
        state.lastUpdate = Date.now();
        state.isDecelerating = true;

        const animate = () => {
          const now = Date.now();
          const dt = Math.min(now - state.lastUpdate, 16); // Cap at 16ms for 60fps
          state.lastUpdate = now;

          // Apply friction
          state.velocity.x *= friction;
          state.velocity.y *= friction;

          // Check if momentum should stop
          const speed = Math.sqrt(
            state.velocity.x * state.velocity.x +
              state.velocity.y * state.velocity.y
          );

          if (speed < threshold) {
            state.isDecelerating = false;
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
            return;
          }

          // Apply momentum movement
          onUpdateTransform(state.velocity.x * dt, state.velocity.y * dt);

          // Continue animation
          animationRef.current = requestAnimationFrame(animate);
        };

        // Stop any existing animation
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }

        // Start new animation
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [onUpdateTransform, friction, threshold]
  );

  const stopMomentum = useCallback(() => {
    const state = momentumRef.current;
    state.isDecelerating = false;
    state.velocity.x = 0;
    state.velocity.y = 0;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const isDecelerating = () => momentumRef.current.isDecelerating;

  return {
    startMomentum,
    stopMomentum,
    isDecelerating,
  };
}
