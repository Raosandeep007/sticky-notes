import React from "react";

export function LoadingState() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      <div className="flex flex-wrap gap-2 sm:gap-4 mt-8 justify-center">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-pulse rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  );
}
