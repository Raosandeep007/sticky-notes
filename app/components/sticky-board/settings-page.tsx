import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, RotateCcw, Palette } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Switch } from "./switch";
import { useSettings } from "./hooks/use-settings";
import { colorPalette } from "./constants";
import { type NoteColor } from "./note";
import { cn } from "~/lib/utils";

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
    useDefaultColor,
  } = useSettings();

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Settings
                </h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
              </div>

              {/* Note Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Notes</h3>

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
                      Use default color for notes (when off, uses random colors)
                    </p>
                  </div>
                  <Switch
                    id="default-color-toggle"
                    checked={useDefaultColor}
                    onCheckedChange={() => toggleSetting("useDefaultColor")}
                  />
                </div>

                {/* Default Note Color */}
                <div
                  className={cn("space-y-3", !useDefaultColor && "opacity-50")}
                >
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
                        onClick={() =>
                          useDefaultColor && handleColorSelect(color)
                        }
                        disabled={!useDefaultColor}
                        className={cn(
                          "w-12 h-12 rounded-lg border-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                          useDefaultColor
                            ? "hover:scale-105"
                            : "cursor-not-allowed",
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
                            <Palette className="w-4 h-4 text-gray-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
