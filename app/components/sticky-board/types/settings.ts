import { type NoteColor } from "../note";

export interface AppSettings {
  showMiniMap: boolean;
  defaultNoteColor: NoteColor;
  showGrid: boolean;
  autoSave: boolean;
  animationsEnabled: boolean;
  useDefaultColor: boolean; // Toggle for using default color vs random color
  [key: string]: any; // Index signature for useSharedState compatibility
}

export const DEFAULT_SETTINGS: AppSettings = {
  showMiniMap: true,
  defaultNoteColor: { name: "yellow", color: "#fef3c7", border: "#f59e0b" },
  showGrid: true,
  autoSave: true,
  animationsEnabled: true,
  useDefaultColor: true, // Default to using the default color
};
