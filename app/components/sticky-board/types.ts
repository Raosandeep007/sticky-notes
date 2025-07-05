export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}

export interface DragState {
  draggingId: string | null;
  offset: { x: number; y: number };
}

export interface PanState {
  isPanning: boolean;
  panStart: { x: number; y: number };
}

export interface TouchZoomState {
  initialDistance: number;
  initialScale: number;
}
