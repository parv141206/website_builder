import { motion } from "motion/react";
import { LuFolderTree } from "react-icons/lu";
import { Layers, DefaultLayer } from "~/components/core/craft/layers-panel";
import { useOutlinePanelStore } from "~/store/OutlinePanelStore";

const OUTLINE_WIDTH = 272; // tailwind w-68 = 17rem = 272px

export function OutlinePanel() {
  const { isOutlinePanelOpen } = useOutlinePanelStore();

  return (
    <motion.aside
      initial={false}
      animate={
        isOutlinePanelOpen
          ? { width: OUTLINE_WIDTH, opacity: 1 }
          : { width: 0, opacity: 0 }
      }
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="flex-shrink-0 overflow-hidden bg-white shadow-lg"
      style={{
        willChange: "width, opacity",
        pointerEvents: isOutlinePanelOpen ? "auto" : "none",
      }}
    >
      <div className="flex h-full flex-col gap-1 p-3 py-4">
        <div className="flex items-center justify-start gap-1 font-bold">
          <LuFolderTree /> <div>Outline</div>
        </div>
        <Layers renderLayer={DefaultLayer} />
      </div>
    </motion.aside>
  );
}
