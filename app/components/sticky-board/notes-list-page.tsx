import React from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Trash2 } from "lucide-react";
import { Drawer } from "./drawer";
import { type NoteTypes } from "./note";
import { cn } from "~/lib/utils";
import { useDevice } from "./hooks/use-device";
import { Button } from "~/components/ui/button";

interface NotesListPageProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteTypes[];
  onNavigateToNote: (note: NoteTypes) => void;
  onClearAll: () => void;
}

export function NotesListPage({
  isOpen,
  onClose,
  notes,
  onNavigateToNote,
  onClearAll,
}: NotesListPageProps) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const { isMobile } = useDevice();

  // Filter notes based on search term
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNoteClick = (note: NoteTypes) => {
    onNavigateToNote(note);
    onClose();
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement={isMobile ? "bottom" : "left"}
      title="All Notes"
      subtitle={`${notes.length} note${notes.length !== 1 ? "s" : ""}`}
      icon={<MapPin className="w-4 h-4 text-white" />}
    >
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              {notes.length === 0 ? (
                <MapPin className="w-12 h-12 mx-auto mb-3" />
              ) : (
                <Search className="w-12 h-12 mx-auto mb-3" />
              )}
            </div>
            <p className="text-gray-500">
              {notes.length === 0
                ? "No notes created yet"
                : "No notes match your search"}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNoteClick(note)}
              className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
              style={{
                borderLeftColor: note.color.border,
                borderLeftWidth: "4px",
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Note Color Indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{
                        backgroundColor: note.color.color,
                        borderColor: note.color.border,
                      }}
                    />
                    <span className="text-xs text-gray-500 capitalize">
                      {note.color.name}
                    </span>
                  </div>

                  {/* Note Text Preview */}
                  <div className="mb-2">
                    {note.text.trim() ? (
                      <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">
                        {note.text}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Empty note</p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {note.date} • {note.time}
                    </span>
                  </div>
                </div>

                {/* Navigate Button */}
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      {notes.length > 0 && (
        <div className="p-4 border-t border-gray-100 bg-gray-50 space-y-3">
          <p className="text-xs text-gray-500 text-center">
            Click on any note to navigate to it on the canvas
          </p>

          {/* Clear All Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete all notes? This action cannot be undone."
                  )
                ) {
                  onClearAll();
                  onClose();
                }
              }}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-full max-w-xs"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Notes
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
