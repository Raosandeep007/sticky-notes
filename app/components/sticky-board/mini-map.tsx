import React from "react";
import { type NoteTypes } from "./note";
import { type CanvasTransform } from "./types";

interface MiniMapProps {
  canvasTransform: CanvasTransform;
  notes: NoteTypes[];
  onNavigate: (x: number, y: number) => void;
}

export function MiniMap({ canvasTransform, notes, onNavigate }: MiniMapProps) {
  const mapSize = 200;
  const mapScale = 0.05; // How much of the canvas to show in the minimap

  // Calculate viewport size and position in minimap coordinates
  const viewportWidth = (window.innerWidth / canvasTransform.scale) * mapScale;
  const viewportHeight =
    (window.innerHeight / canvasTransform.scale) * mapScale;
  const viewportX =
    (-canvasTransform.x / canvasTransform.scale) * mapScale +
    mapSize / 2 -
    viewportWidth / 2;
  const viewportY =
    (-canvasTransform.y / canvasTransform.scale) * mapScale +
    mapSize / 2 -
    viewportHeight / 2;

  // Handle click to navigate
  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    // Convert minimap coordinates to canvas coordinates
    const canvasX = (clickX - mapSize / 2) / mapScale;
    const canvasY = (clickY - mapSize / 2) / mapScale;

    // Center the viewport on the clicked point
    const newTransformX =
      -canvasX * canvasTransform.scale + window.innerWidth / 2;
    const newTransformY =
      -canvasY * canvasTransform.scale + window.innerHeight / 2;

    onNavigate(newTransformX, newTransformY);
  };

  return (
    <div className="fixed bottom-4 left-4 z-20">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-2 shadow-lg">
        <div
          className="relative cursor-pointer bg-gray-50 rounded border overflow-hidden"
          style={{ width: mapSize, height: mapSize }}
          onClick={handleClick}
        >
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, #94a3b8 1px, transparent 1px),
                linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Center crosshair */}
          <div
            className="absolute w-px h-full bg-blue-400/50"
            style={{ left: mapSize / 2 }}
          />
          <div
            className="absolute h-px w-full bg-blue-400/50"
            style={{ top: mapSize / 2 }}
          />

          {/* Notes */}
          {notes.map((note) => {
            const noteX = note.x * mapScale + mapSize / 2;
            const noteY = note.y * mapScale + mapSize / 2;

            // Only show notes that are reasonably close to the viewport
            if (
              noteX < -50 ||
              noteX > mapSize + 50 ||
              noteY < -50 ||
              noteY > mapSize + 50
            ) {
              return null;
            }

            return (
              <div
                key={note.id}
                className="absolute w-2 h-2 rounded-full border border-white/50 shadow-sm"
                style={{
                  left: noteX - 4,
                  top: noteY - 4,
                  backgroundColor: note.color.border,
                }}
              />
            );
          })}

          {/* Viewport indicator */}
          <div
            className="absolute border-2 border-blue-500 bg-blue-500/10 rounded"
            style={{
              left: Math.max(0, Math.min(mapSize - viewportWidth, viewportX)),
              top: Math.max(0, Math.min(mapSize - viewportHeight, viewportY)),
              width: Math.min(viewportWidth, mapSize),
              height: Math.min(viewportHeight, mapSize),
            }}
          />
        </div>

        {/* Zoom indicator */}
        <div className="mt-2 text-xs text-gray-600 text-center">
          {Math.round(canvasTransform.scale * 100)}%
        </div>
      </div>
    </div>
  );
}
