import React, { useState } from "react";
import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Drawer } from "./drawer";
import { type Canvas } from "./hooks/use-canvas-management";
import { cn } from "~/lib/utils";
import { useDevice } from "./hooks/use-device";

interface CanvasManagerPageProps {
  isOpen: boolean;
  onClose: () => void;
  canvases: Canvas[];
  activeCanvas: Canvas | null;
  onSwitchCanvas: (canvasId: string) => void;
  onCreateCanvas: (name?: string) => void;
  onDeleteCanvas: (canvasId: string) => void;
  onUpdateCanvasName: (canvasId: string, newName: string) => void;
}

export function CanvasManagerPage({
  isOpen,
  onClose,
  canvases,
  activeCanvas,
  onSwitchCanvas,
  onCreateCanvas,
  onDeleteCanvas,
  onUpdateCanvasName,
}: CanvasManagerPageProps) {
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { isMobile } = useDevice();

  const handleEditStart = (canvas: Canvas) => {
    setEditingCanvasId(canvas.id);
    setEditingName(canvas.name);
  };

  const handleEditSave = (canvasId: string) => {
    if (editingName.trim()) {
      onUpdateCanvasName(canvasId, editingName.trim());
    }
    setEditingCanvasId(null);
    setEditingName("");
  };

  const handleEditCancel = () => {
    setEditingCanvasId(null);
    setEditingName("");
  };

  const handleCreateNew = () => {
    const name = prompt("Enter canvas name:");
    if (name?.trim()) {
      onCreateCanvas(name.trim());
    }
  };

  const handleSwitchCanvas = (canvasId: string) => {
    onSwitchCanvas(canvasId);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={isMobile ? "bottom" : "left"}
      title="Canvas Manager"
      subtitle={`${canvases.length} canvas${canvases.length !== 1 ? "es" : ""}`}
      icon={<FolderOpen className="w-4 h-4 text-white" />}
    >
      {/* Canvas Manager Content */}
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Actions</h3>

          {/* Create New Canvas Button */}
          <Button
            onClick={handleCreateNew}
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Canvas
          </Button>
        </div>

        {/* Canvas List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Canvases</h3>

          {canvases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No canvases yet</p>
              <p className="text-xs">Create your first canvas above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {canvases.map((canvas) => (
                <div
                  key={canvas.id}
                  className={cn(
                    "p-4 border rounded-lg transition-all",
                    activeCanvas?.id === canvas.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingCanvasId === canvas.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(canvas.id);
                              if (e.key === "Escape") handleEditCancel();
                            }}
                            onBlur={() => handleEditSave(canvas.id)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                            placeholder="Canvas name"
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSwitchCanvas(canvas.id)}
                          className="flex-1 text-left w-full group"
                        >
                          <div className="font-medium text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                            {canvas.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {canvas.notesCount} note
                            {canvas.notesCount !== 1 ? "s" : ""}
                            {" • "}
                            {new Date(canvas.updatedAt).toLocaleDateString()}
                          </div>
                        </button>
                      )}
                    </div>

                    {editingCanvasId !== canvas.id && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditStart(canvas)}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Rename canvas"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {canvases.length > 1 && (
                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  `Are you sure you want to delete "${canvas.name}"? This action cannot be undone.`
                                )
                              ) {
                                onDeleteCanvas(canvas.id);
                              }
                            }}
                            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete canvas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Active Canvas Indicator */}
                  {activeCanvas?.id === canvas.id && (
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Currently Active
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
}
