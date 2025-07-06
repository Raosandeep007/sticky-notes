import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(0 0% 100%)",
          "--normal-text": "",
          "--normal-border": "hsl(214.3 31.8% 91.4%)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          backdropFilter: "blur(4px)",
          borderRadius: "9999px",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
          background: "rgba(255, 255, 255, 0.5)",
        },
        className: "backdrop-blur-sm rounded-full shadow-sm border-white/20",
      }}
      {...props}
    />
  );
};

export { Toaster };
