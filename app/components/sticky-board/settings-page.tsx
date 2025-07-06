import React from "react";
import { Settings, RotateCcw, Palette } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "./switch";
import { Drawer } from "./drawer";
import { useSettings } from "~/hooks/use-settings";
import { colorPalette } from "./constants";
import { type NoteColor } from "./note";
import { cn } from "~/lib/utils";
import { useDevice } from "~/hooks/use-device";

interface SettingsPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPage({ isOpen, onClose }: SettingsPageProps) {
  const {
    settings,
    updateSetting,
    toggleSetting,
    resetSettings,
    showMiniMap,
    defaultNoteColor,
    showGrid,
    autoSave,
    animationsEnabled,
    useDefaultColor,
  } = useSettings();
  const { isMobile } = useDevice();

  const handleColorSelect = (color: NoteColor) => {
    updateSetting("defaultNoteColor", color);
  };

  const handleReset = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      resetSettings();
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={isMobile ? "bottom" : "right"}
      title="Settings"
      subtitle="Customize your workspace"
      icon={<Settings className="w-4 h-4 text-white" />}
    >
      {/* Settings Content */}
      <div className="p-6 space-y-6">
        {/* Display Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Display</h3>

          {/* Mini Map Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="minimap-toggle"
                className="text-sm font-medium text-gray-700"
              >
                Show Mini Map
              </label>
              <p className="text-xs text-gray-500">
                Display navigation mini map in corner
              </p>
            </div>
            <Switch
              id="minimap-toggle"
              checked={showMiniMap}
              onCheckedChange={() => toggleSetting("showMiniMap")}
            />
          </div>

          {/* Grid Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="grid-toggle"
                className="text-sm font-medium text-gray-700"
              >
                Show Grid
              </label>
              <p className="text-xs text-gray-500">
                Display background grid lines
              </p>
            </div>
            <Switch
              id="grid-toggle"
              checked={showGrid}
              onCheckedChange={() => toggleSetting("showGrid")}
            />
          </div>

          {/* Animations Toggle */}
          {/* <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="animations-toggle"
                className="text-sm font-medium text-gray-700"
              >
                Enable Animations
              </label>
              <p className="text-xs text-gray-500">
                Smooth transitions and effects
              </p>
            </div>
            <Switch
              id="animations-toggle"
              checked={animationsEnabled}
              onCheckedChange={() => toggleSetting("animationsEnabled")}
            />
          </div> */}

          {/* Auto Save Toggle */}
          {/* <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="autosave-toggle"
                className="text-sm font-medium text-gray-700"
              >
                Auto Save
              </label>
              <p className="text-xs text-gray-500">
                Automatically save changes
              </p>
            </div>
            <Switch
              id="autosave-toggle"
              checked={autoSave}
              onCheckedChange={() => toggleSetting("autoSave")}
            />
          </div> */}
        </div>

        {/* Note Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Notes</h3>

          {/* Use Default Color Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="default-color-toggle"
                className="text-sm font-medium text-gray-700"
              >
                Use Default Color
              </label>
              <p className="text-xs text-gray-500">
                Use default color for new notes (when off, uses random colors)
              </p>
            </div>
            <Switch
              id="default-color-toggle"
              checked={useDefaultColor}
              onCheckedChange={() => toggleSetting("useDefaultColor")}
            />
          </div>

          {/* Default Note Color */}
          <div className={cn("space-y-3", !useDefaultColor && "opacity-50")}>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Default Note Color
              </label>
              <p className="text-xs text-gray-500">Color for new notes</p>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {colorPalette.map((color) => (
                <button
                  key={color.name}
                  onClick={() => useDefaultColor && handleColorSelect(color)}
                  disabled={!useDefaultColor}
                  className={cn(
                    "w-12 h-12 rounded-lg border-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                    useDefaultColor ? "hover:scale-105" : "cursor-not-allowed",
                    defaultNoteColor.name === color.name
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  style={{
                    backgroundColor: color.color,
                    borderColor:
                      defaultNoteColor.name === color.name
                        ? "#3b82f6"
                        : color.border,
                  }}
                  title={`${color.name} note`}
                >
                  {defaultNoteColor.name === color.name && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full border border-gray-300" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
