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
    switch (placement) {
      case "left":
        return {
          initial: { x: "-100%" },
          animate: { x: 0 },
          exit: { x: "-100%" },
        };
      case "right":
        return {
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
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
          initial: { x: "100%" },
          animate: { x: 0 },
          exit: { x: "100%" },
        };
    }
  };

  // Position classes based on placement
  const getPositionClasses = () => {
    switch (placement) {
      case "left":
        return `left-0 top-0 ${maxHeight} w-full ${maxWidth}`;
      case "right":
        return `right-0 top-0 ${maxHeight} w-full ${maxWidth}`;
      case "top":
        return `top-0 left-0 w-full h-full max-h-96 ${maxHeight}`;
      case "bottom":
        return `bottom-0 left-0 w-full max-h-4/5 ${maxHeight}`;
      default:
        return `right-0 top-0 ${maxHeight} w-full ${maxWidth}`;
    }
  };

  const variants = getAnimationVariants();
  const positionClasses = getPositionClasses();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bg-white shadow-2xl z-50 overflow-hidden",
              positionClasses
            )}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
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
              <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
