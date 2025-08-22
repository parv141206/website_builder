"use client";

import React, { useEffect, useState } from "react";
import { Element, useNode } from "@craftjs/core";
import { Container } from "../../primitives/Container";
import { Text } from "../../primitives/Typography/Text";
import { Button } from "../../primitives/Button";
import { Image } from "../../primitives/Image";

type GalleryItem = { src: string; alt?: string };

const images: GalleryItem[] = [
  { src: "https://picsum.photos/640/640?random=1", alt: "Image 1" },
  { src: "https://picsum.photos/640/640?random=2", alt: "Image 2" },
  { src: "https://picsum.photos/640/640?random=3", alt: "Image 3" },
  { src: "https://picsum.photos/640/640?random=4", alt: "Image 4" },
  { src: "https://picsum.photos/640/640?random=5", alt: "Image 5" },
];

export const CircularGallerySection: React.FC = () => {
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const {
    connectors: { connect, drag },
  } = useNode();

  // Close modal with ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Container
      ref={(ref: any) => ref && connect(drag(ref))}
      style={{
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(12px) saturate(140%)",
        WebkitBackdropFilter: "blur(12px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.20)",
        boxShadow: "0 6px 24px rgba(0,0,0,0.20)",
        borderRadius: "24px",
        maxWidth: "1200px",
        margin: "40px auto",
        padding: "40px",
      }}
    >
      {/* Header */}
      <Container style={{ textAlign: "center", marginBottom: "32px" }}>
        <Text
          as="h2"
          text="Circular Image Gallery"
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            lineHeight: 1.2,
            background: "linear-gradient(135deg, #6ee7b7, #3b82f6)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        />
        <Text
          as="p"
          text="Explore images in a smooth, circular layout with glassmorphic design."
          style={{
            fontSize: "1rem",
            marginTop: "8px",
            color: "rgba(255,255,255,0.75)",
          }}
        />
      </Container>

      {/* Image Grid */}
      <Container
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "24px",
        }}
      >
        {images.map((img, index) => (
          <Container
            key={index}
            onClick={() => setSelected(img)}
            style={{
              position: "relative",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
              border: "2px solid rgba(255,255,255,0.22)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              aspectRatio: "1 / 1",
              background:
                "radial-gradient(120% 120% at 0% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            }}
          >
            <Image
              src={img.src}
              alt={img.alt || `Gallery image ${index + 1}`}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          </Container>
        ))}
      </Container>

      {/* Modal */}
      {selected && (
        <Container
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06))",
            backdropFilter: "blur(14px) saturate(160%)",
            WebkitBackdropFilter: "blur(14px) saturate(160%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Container
            onClick={(e: any) => e.stopPropagation()}
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.10))",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              borderRadius: "20px",
              padding: "20px",
              maxWidth: "86vw",
              maxHeight: "86vh",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <Image
              src={selected.src}
              alt={selected.alt ?? "Selected image"}
              style={{
                maxWidth: "78vw",
                maxHeight: "70vh",
                objectFit: "contain",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
              }}
            />
            <Container style={{ display: "flex", justifyContent: "center" }}>
              <Button
                onClick={() => setSelected(null)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.12))",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(8px) saturate(160%)",
                  WebkitBackdropFilter: "blur(8px) saturate(160%)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  cursor: "pointer",
                }}
              >
                Close
              </Button>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};
