import { useSharedState } from "@airstate/react";
import { useCallback } from "react";
import {
  type AppSettings,
  DEFAULT_SETTINGS,
} from "~/components/sticky-board/types/settings";

export function useSettings() {
  const [settings, setSettings, isReady] = useSharedState<AppSettings>(
    DEFAULT_SETTINGS,
    {
      key: JSON.stringify(DEFAULT_SETTINGS),
    }
  );

  // Update specific setting
  const updateSetting = useCallback(
    <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [setSettings]
  );

  // Toggle boolean settings
  const toggleSetting = useCallback(
    (key: keyof AppSettings) => {
      setSettings((prev) => {
        const currentValue = prev[key];
        if (typeof currentValue === "boolean") {
          return { ...prev, [key]: !currentValue };
        }
        return prev;
      });
    },
    [setSettings]
  );

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  // Get specific setting
  const getSetting = useCallback(
    <K extends keyof AppSettings>(key: K): AppSettings[K] => {
      return settings[key];
    },
    [settings]
  );

  return {
    settings,
    isReady,
    updateSetting,
    toggleSetting,
    resetSettings,
    getSetting,
    // Convenience getters for common settings
    showMiniMap: settings.showMiniMap,
    defaultNoteColor: settings.defaultNoteColor,
    showGrid: settings.showGrid,
    autoSave: settings.autoSave,
    animationsEnabled: settings.animationsEnabled,
    useDefaultColor: settings.useDefaultColor,
  };
}
