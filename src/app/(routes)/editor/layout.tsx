import React, { type ReactNode } from "react";
import { ThemeProvider } from "~/themes";

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  );
}
