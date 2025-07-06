import { useState, useEffect } from "react";

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
}

export function useDevice(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // Initialize with default values for SSR
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        width: 1024,
        height: 768,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    return {
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      width,
      height,
    };
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDeviceInfo({
        isMobile: width < 768, // Tailwind md breakpoint
        isTablet: width >= 768 && width < 1024, // Tailwind md to lg
        isDesktop: width >= 1024, // Tailwind lg+
        width,
        height,
      });
    };

    // Initial check
    updateDeviceInfo();

    // Add event listener for window resize
    window.addEventListener("resize", updateDeviceInfo);

    // Cleanup
    return () => window.removeEventListener("resize", updateDeviceInfo);
  }, []);

  return deviceInfo;
}
