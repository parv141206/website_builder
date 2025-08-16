
"use client";
import React from "react";
import { Container } from "./components/Container";
import { Text } from "./components/Text";

export default function Page() {
  return (
    <div id="ROOT" style={{"display":"flex","flexDirection":"column","gap":"8px","padding":"24px","width":"100%","background":"#111827","minHeight":"100%"}}>
      <Text text="Welcome to your new page!" as="h1" fontSize="24px" fontWeight="bold" lineHeight="1.5" textAlign="center" margin="0 0 24px 0" />
<Container display="flex" flexDirection="column" gap="8px" padding="16px" width="100%" background="#f3f4f6" borderRadius="8px"><Text text="This is an inner container. Drag components here or double-click to edit text." as="p" fontSize="16px" fontWeight={400} lineHeight="1.5" textAlign="left" /></Container>
    </div>
  );
}