import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  placement?: "left" | "right" | "top" | "bottom";
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
}

export function Drawer({
  isOpen,
  onClose,
  placement = "right",
  title,
  subtitle,
  icon,
  children,
  maxWidth = "max-w-md",
  maxHeight = "h-full",
}: DrawerProps) {
  // Animation variants for different placements
  const getAnimationVariants = () => {
    const isFloating = placement === "left" || placement === "right";

    switch (placement) {
      case "left":
        return {
          initial: {
            x: "-100%",
            opacity: isFloating ? 0 : 1,
            scale: isFloating ? 0.9 : 1,
          },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: {
            x: "-100%",
            opacity: isFloating ? 0 : 1,
            scale: isFloating ? 0.9 : 1,
          },
        };
      case "right":
        return {
          initial: {
            x: "100%",
            opacity: isFloating ? 0 : 1,
            scale: isFloating ? 0.9 : 1,
          },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: {
            x: "100%",
            opacity: isFloating ? 0 : 1,
            scale: isFloating ? 0.9 : 1,
          },
        };
      case "top":
        return {
          initial: { y: "-100%" },
          animate: { y: 0 },
          exit: { y: "-100%" },
        };
      case "bottom":
        return {
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
        };
      default:
        return {
          initial: {
            x: "100%",
            opacity: isFloating ? 0 : 1,
            scale: isFloating ? 0.9 : 1,
          },
          animate: { x: 0, opacity: 1, scale: 1 },
          exit: {
            x: "100%",
            opacity: isFloating ? 0 : 1,
            scale: isFloating ? 0.9 : 1,
          },
        };
    }
  };

  // Position classes based on placement
  const getPositionClasses = () => {
    switch (placement) {
      case "left":
        return `left-4 top-4 bottom-4 w-full ${maxWidth}`;
      case "right":
        return `right-4 top-4 bottom-4 w-full ${maxWidth}`;
      case "top":
        return `top-0 left-0 w-full h-full max-h-96 ${maxHeight}`;
      case "bottom":
        return `bottom-0 left-0 w-full max-h-4/5 ${maxHeight}`;
      default:
        return `right-4 top-4 bottom-4 w-full ${maxWidth}`;
    }
  };

  // Get styling classes based on placement
  const getStylingClasses = () => {
    const isFloating = placement === "left" || placement === "right";

    if (isFloating) {
      return "bg-white/40 shadow-xl shadow-black/10 rounded-xl border border-white/20 backdrop-blur-xl";
    }

    if (placement === "bottom") {
      return "bg-white/50 shadow-xl shadow-black/10 backdrop-blur-xl rounded-t-xl";
    }

    if (placement === "top") {
      return "bg-white/50 shadow-xl shadow-black/10 backdrop-blur-xl rounded-b-xl";
    }
  };

  const variants = getAnimationVariants();
  const positionClasses = getPositionClasses();
  const stylingClasses = getStylingClasses();
  const isFloating = placement === "left" || placement === "right";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - only show for floating drawers or full screen */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={cn("fixed inset-0 z-50 bg-black/20 backdrop-blur-sm")}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed z-50 overflow-hidden",
              positionClasses,
              stylingClasses
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div
                className={cn(
                  "flex items-center justify-between p-4 border-b bg-white/50",
                  isFloating
                    ? "rounded-t-xl border-gray-100/50"
                    : "from-blue-50 to-indigo-50 border-gray-200"
                )}
              >
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {title}
                    </h2>
                    {subtitle && (
                      <p className="text-sm text-gray-600">{subtitle}</p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <div
                className={cn(
                  "flex-1 overflow-y-auto",
                  isFloating && "rounded-b-xl"
                )}
              >
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
