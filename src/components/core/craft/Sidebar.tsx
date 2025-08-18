import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { ThemePanel } from "./ThemePanel";
import ImageManager from "./image-manager/ImageManager";
import { SettingsPanel } from "./SettingsPanel";

const SIDEBAR_WIDTH = "20rem"; // matches tailwind w-80

export function Sidebar({ activePanel }: { activePanel: string }) {
  const [lastPanel, setLastPanel] = useState<string | null>(
    activePanel !== "hide" ? activePanel : null,
  );

  useEffect(() => {
    if (activePanel !== "hide") {
      setLastPanel(activePanel);
    }
  }, [activePanel]);

  const isHidden = activePanel === "hide";

  return (
    <motion.aside
      initial={false}
      animate={
        isHidden
          ? { width: 0, opacity: 0 }
          : { width: SIDEBAR_WIDTH, opacity: 1 }
      }
      transition={{ duration: 0.28, ease: "easeInOut" }}
      onAnimationComplete={() => {
        if (isHidden) setLastPanel(null);
      }}
      className="flex-shrink-0 overflow-hidden bg-white shadow-lg"
      style={{
        pointerEvents: isHidden ? "none" : "auto",
        willChange: "width, opacity",
      }}
    >
      <div className="h-full">
        {lastPanel === "theme" && <ThemePanel />}
        {lastPanel === "images" && <ImageManager />}
        {lastPanel === "settings" && <SettingsPanel />}
      </div>
    </motion.aside>
  );
}
