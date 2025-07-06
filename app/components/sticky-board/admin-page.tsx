import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreatedLinks } from "~/hooks/use-created-links";
import {
  ExternalLink,
  Trash2,
  Copy,
  Calendar,
  Eye,
  Edit3,
  Check,
  X,
  RefreshCw,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

export function AdminPage() {
  const {
    links,
    removeLink,
    clearAllLinks,
    updateLinkTitle,
    totalLinks,
    isReady,
  } = useCreatedLinks();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy link:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleEditTitle = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle || "");
  };

  const handleSaveTitle = (id: string) => {
    updateLinkTitle(id, editTitle);
    setEditingId(null);
    setEditTitle("");
    toast.success("Title updated!");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Show loading state if data is not ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-white/20">
          <div className="flex items-center space-x-3">
            <RefreshCw className="w-5 h-5 animate-spin text-slate-600" />
            <span className="text-slate-600">Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6 border border-white/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-slate-600">
                Manage all created sticky notes workspaces
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {totalLinks}
              </div>
              <div className="text-sm text-slate-500">Total Workspaces</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {
                    links.filter((link) => {
                      const today = new Date();
                      const linkDate = new Date(link.createdAt);
                      return linkDate.toDateString() === today.toDateString();
                    }).length
                  }
                </div>
                <div className="text-sm text-slate-500">Created Today</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {links.reduce((total, link) => total + link.visitCount, 0)}
                </div>
                <div className="text-sm text-slate-500">Total Visits</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {
                    links.filter((link) => {
                      const lastVisit = new Date(
                        link.lastVisited || link.createdAt
                      );
                      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                      return lastVisit > dayAgo;
                    }).length
                  }
                </div>
                <div className="text-sm text-slate-500">Active (24h)</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20"
        >
          <div className="flex gap-3">
            <Button
              onClick={clearAllLinks}
              variant="destructive"
              size="sm"
              disabled={totalLinks === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Links List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <AnimatePresence>
            {links.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center border border-white/20"
              >
                <div className="text-slate-400 text-lg mb-2">
                  No workspaces created yet
                </div>
                <div className="text-slate-500 text-sm">
                  Create a new workspace to see it appear here
                </div>
              </motion.div>
            ) : (
              links.map((link) => (
                <motion.div
                  key={link.id}
                  variants={itemVariants}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {editingId === link.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="flex-1 px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter title..."
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveTitle(link.id)}
                              className="px-2"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="px-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-semibold text-slate-800 truncate">
                              {link.title || `Workspace ${link.id}`}
                            </h3>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                handleEditTitle(link.id, link.title || "")
                              }
                              className="px-2 py-1 h-auto"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>

                      <div className="text-sm text-slate-600 font-mono truncate mb-2">
                        {link.url}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created: {formatDate(link.createdAt)}
                        </span>
                        {link.lastVisited && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            Last visit: {formatDate(link.lastVisited)}
                          </span>
                        )}
                        <span className="bg-slate-100 px-2 py-1 rounded-full">
                          {link.visitCount} visits
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyLink(link.url)}
                        title="Copy link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(link.url, "_blank")}
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeLink(link.id)}
                        title="Delete workspace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
