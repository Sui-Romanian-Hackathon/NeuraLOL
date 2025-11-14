// src/hooks/useIsSuiWalletAppInstalled.js
import { useState, useEffect } from "react";

export default function useIsSuiWalletAppInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const deepLink = "suiwallet://connect";
    const fallbackTimeout = 1000;

    const startTime = Date.now();

    // Încearcă să deschidă app-ul
    window.location.href = deepLink;

    const timer = setTimeout(() => {
      const timeElapsed = Date.now() - startTime;
      if (timeElapsed < fallbackTimeout + 100) {
        setIsInstalled(false);
      }
    }, fallbackTimeout);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearTimeout(timer);
        setIsInstalled(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isInstalled;
}
