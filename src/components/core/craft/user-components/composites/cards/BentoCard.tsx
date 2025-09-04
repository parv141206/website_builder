"use client";

import React from "react";
import { Container } from "../../primitives/Container";
import { Card1 } from "../../composites/cards/Card1";

const Eight: React.FC = () => {
  return (
    <Container className="grid min-h-screen grid-cols-6 grid-rows-4 gap-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      {/* Card 1 */}
      <Card1
        title="Wide Glass Card"
        description="This card spans 3 columns and 2 rows."
        containerProps={{
          padding: "24px",
          className:
            "col-span-3 row-span-2 flex flex-col justify-center items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg",
        }}
      />

      {/* Card 2 */}
      <Card1
        title="Tall Card"
        description="This card is taller and spans 2x2."
        containerProps={{
          padding: "20px",
          className:
            "col-span-2 row-span-2 flex flex-col justify-center items-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg",
        }}
      />

      {/* Card 3 */}
      <Card1
        title="Small Card"
        description="1x1 small card."
        containerProps={{
          padding: "16px",
          className:
            "col-span-1 row-span-1 flex flex-col justify-center items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-lg",
        }}
      />

      {/* Card 4 */}
      <Card1
        title="Medium Card"
        description="2 columns wide, 1 row tall."
        containerProps={{
          padding: "20px",
          className:
            "col-span-2 row-span-1 flex flex-col justify-center items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-lg",
        }}
      />

      {/* Card 5 */}
      <Card1
        title="Wide Short"
        description="3 columns wide, 1 row tall."
        containerProps={{
          padding: "20px",
          className:
            "col-span-3 row-span-1 flex flex-col justify-center items-center backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg",
        }}
      />

      {/* Card 6 */}
      <Card1
        title="Slim Tall"
        description="1 column wide, 2 rows tall."
        containerProps={{
          padding: "16px",
          className:
            "col-span-1 row-span-2 flex flex-col justify-center items-center backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-lg",
        }}
      />
    </Container>
  );
};

export default Eight;
