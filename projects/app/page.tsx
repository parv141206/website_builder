
"use client";
import React from "react";
import { Container } from "./components/Container";
import { Text } from "./components/Text";
import { Button } from "./components/Button";

export default function Page() {
  return (
    <div id="ROOT" style={{"display":"flex","flexDirection":"column","gap":"8px","padding":"24px","width":"100%","background":"#e9e4d9","minHeight":"100%"}}>
      <Text text="Welcome to your new page!" as="h1" fontSize="24px" fontWeight="bold" lineHeight="1.5" textAlign="center" margin="0 0 24px 0" />
<Container display="flex" flexDirection="column" gap="8px" padding="16px" width="100%" background="#e4dfd6" borderRadius="8px"><Text text="This is an inner container." as="p" fontSize="16px" fontWeight={400} lineHeight="1.5" textAlign="left" /></Container>
<Container display="flex" flexDirection="column" gap="8px" padding="16px" width="100%" borderRadius="8px" boxShadow="0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"><Text text="Card Title" as="h3" fontSize="20px" fontWeight="bold" lineHeight="1.5" textAlign="left" id="Card1-title" margin="0 0 8px 0" />
<Text text="A short subtitle." as="p" fontSize="14px" fontWeight={400} lineHeight="1.5" textAlign="left" id="Card1-description" /></Container>
<Container display="flex" flexDirection="column" gap="8px" padding="16px" width="100%" background="#f3f4f6" borderRadius="8px" minHeight="80px" />
<Text text="New Text" as="p" fontSize="16px" fontWeight={400} lineHeight="1.5" textAlign="left" />
<Button text="Click Me" containerProps={{}} textProps={{}} />
    </div>
  );
}