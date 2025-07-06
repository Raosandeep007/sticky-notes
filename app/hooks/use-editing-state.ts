import { useState, useEffect } from "react";

export function useEditingState() {
  const [isEditingNote, setIsEditingNote] = useState(false);

  // Track if user is editing a note
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") {
        setIsEditingNote(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      if ((e.target as HTMLElement)?.tagName === "TEXTAREA") {
        setIsEditingNote(false);
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return { isEditingNote };
}
