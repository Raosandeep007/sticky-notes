import React from "react";

interface InfiniteGridProps {
  canvasTransform: {
    x: number;
    y: number;
    scale: number;
  };
}

export function InfiniteGrid({ canvasTransform }: InfiniteGridProps) {
  const { x, y, scale } = canvasTransform;

  // Multi-level grid system like Figma
  const baseGridSize = 20; // Base 20px grid
  const majorGridMultiplier = 5; // Every 5th line is major (100px)

  // Calculate adaptive grid sizes based on zoom
  let gridSize = baseGridSize;
  let majorGridSize = baseGridSize * majorGridMultiplier;

  // Adaptive grid sizing - similar to Figma's approach
  if (scale < 0.25) {
    gridSize = baseGridSize * 8; // 160px
    majorGridSize = gridSize * 2; // 320px
  } else if (scale < 0.5) {
    gridSize = baseGridSize * 4; // 80px
    majorGridSize = gridSize * 2; // 160px
  } else if (scale < 1) {
    gridSize = baseGridSize * 2; // 40px
    majorGridSize = gridSize * 2.5; // 100px
  } else if (scale > 2) {
    gridSize = baseGridSize / 2; // 10px
    majorGridSize = baseGridSize * 2; // 40px
  }

  // Scale the grid sizes with canvas transform
  const scaledGridSize = gridSize * scale;
  const scaledMajorGridSize = majorGridSize * scale;

  // Don't show grid if too small or too large
  if (scaledGridSize < 4 || scaledGridSize > 200) {
    return null;
  }

  // Calculate offsets for grid positioning
  const offsetX = x % scaledGridSize;
  const offsetY = y % scaledGridSize;
  const majorOffsetX = x % scaledMajorGridSize;
  const majorOffsetY = y % scaledMajorGridSize;

  // Calculate opacities based on zoom level
  const minorOpacity = Math.max(0.03, Math.min(0.15, scale * 0.3));
  const majorOpacity = Math.max(0.08, Math.min(0.25, scale * 0.5));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Minor grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, ${minorOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, ${minorOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
          backgroundPosition: `${offsetX}px ${offsetY}px`,
        }}
      />

      {/* Major grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100, 116, 139, ${majorOpacity}) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100, 116, 139, ${majorOpacity}) 1px, transparent 1px)
          `,
          backgroundSize: `${scaledMajorGridSize}px ${scaledMajorGridSize}px`,
          backgroundPosition: `${majorOffsetX}px ${majorOffsetY}px`,
        }}
      />

      {/* Origin axes - like Figma's center guidelines */}
      {scale > 0.1 && (
        <>
          {/* Vertical axis */}
          <div
            className="absolute w-px bg-blue-400/30"
            style={{
              left: x,
              top: 0,
              height: "100vh",
            }}
          />
          {/* Horizontal axis */}
          <div
            className="absolute h-px bg-blue-400/30"
            style={{
              top: y,
              left: 0,
              width: "100vw",
            }}
          />
        </>
      )}
    </div>
  );
}
