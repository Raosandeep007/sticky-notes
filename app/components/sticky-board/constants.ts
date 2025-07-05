import { type NoteColor } from "./note";

export const MINIMUM_SCALE = 0.1;
export const MAXIMUM_SCALE = 3;
export const ZOOM_STEP = 0.1;
export const DOUBLE_TAP_THRESHOLD = 300;

export const colorPalette: NoteColor[] = [
  { name: "yellow", color: "#fef3c7", border: "#f59e0b" },
  { name: "pink", color: "#fce7f3", border: "#ec4899" },
  { name: "blue", color: "#dbeafe", border: "#3b82f6" },
  { name: "green", color: "#d1fae5", border: "#10b981" },
  { name: "purple", color: "#e9d5ff", border: "#8b5cf6" },
  { name: "orange", color: "#fed7aa", border: "#f97316" },
  { name: "indigo", color: "#e0e7ff", border: "#6366f1" },
  { name: "teal", color: "#ccfbf1", border: "#14b8a6" },
];

export const getRandomColor = (): NoteColor => {
  const randomIndex = Math.floor(Math.random() * colorPalette.length);
  return colorPalette[randomIndex];
};
