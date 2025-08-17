"use client";

import Dexie from "dexie";
import { useState, useEffect } from "react";
export const db = new Dexie("mydb");
db.version(1).stores({
  images: "key",
});

export default function ImageManager() {
  const [images, setImages] = useState<
    { name: string; url: string; path: string }[]
  >([]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newImages: { name: string; url: string; path: string }[] = [];

    for (const file of Array.from(files)) {
      const path = `public/${file.name}`;

      // Save in IndexedDB with public/ prefix as key
      await db.table("images").put({ key: path, blob: file });

      // Use the service worker URL instead of createObjectURL for display
      // This ensures the image is served through the service worker
      const url = `/${path}`; // This will be intercepted by service worker
      newImages.push({ name: file.name, url, path });
    }

    setImages((prev) => [...prev, ...newImages]);
  }

  useEffect(() => {
    (async () => {
      const stored = await db.table("images").toArray();
      const previews = stored.map((img: any) => ({
        name: img.key.replace("public/", ""),
        url: `/${img.key}`, // Use service worker URL
        path: img.key,
      }));
      setImages(previews);
    })();
  }, []);

  return (
    <div className="flex h-screen w-48 flex-col border-r p-2">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="mb-2 text-sm"
      />
      <div className="flex-1 space-y-3 overflow-y-auto">
        {images.map((img) => (
          <div key={img.path} className="flex flex-col items-center">
            <img
              src={img.url}
              alt={img.name}
              className="h-24 w-24 rounded border object-cover"
              onError={(e) => {
                console.error("Failed to load image:", img.url);
                // Fallback to blob URL if service worker fails
                (async () => {
                  try {
                    const record = await db.table("images").get(img.path);
                    if (record?.blob) {
                      (e.target as HTMLImageElement).src = URL.createObjectURL(
                        record.blob,
                      );
                    }
                  } catch (error) {
                    console.error("Failed to create fallback URL:", error);
                  }
                })();
              }}
            />
            <p className="mt-1 text-center text-xs break-all">{img.path}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
