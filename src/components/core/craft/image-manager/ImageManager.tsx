"use client";

import Dexie from "dexie";
import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

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

      let base64: string | null = null;
      try {
        base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result;
            if (typeof result === "string") {
              resolve(result);
            } else {
              reject(new Error("FileReader result is not a string."));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch (error) {
        console.error("Error reading file as Base64:", error);
        continue;
      }

      if (base64) {
        await db.table("images").put({ key: path, base64 });
      } else {
        console.warn(`Skipping ${file.name} due to failed Base64 conversion.`);
        continue;
      }

      const url = `/${path}`;
      newImages.push({ name: file.name, url, path });
    }

    setImages((prev) => [...prev, ...newImages]);
  }

  async function handleDelete(path: string) {
    await db.table("images").delete(path);
    setImages((prev) => prev.filter((img) => img.path !== path));
  }

  useEffect(() => {
    (async () => {
      const stored = await db.table("images").toArray();
      const previews = stored.map((img: any) => ({
        name: img.key.replace("public/", ""),
        url: `/${img.key}`,
        path: img.key,
      }));
      setImages(previews);
    })();
  }, []);

  return (
    <aside className="w-80 overflow-y-auto border-l border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Image Manager</h3>
          <p className="text-sm text-gray-500">Manage your uploaded assets</p>
        </div>
        <label className="cursor-pointer rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-blue-600">
          <Plus className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      <div className="space-y-3">
        {images.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No images uploaded yet.
          </p>
        ) : (
          images.map((img) => (
            <div
              key={img.path}
              className="flex flex-col gap-3 rounded-md border p-2 shadow-sm"
            >
              <img
                src={img.url}
                alt={img.name}
                className="max-h-40 w-full rounded object-cover"
                onError={(e) => {
                  (async () => {
                    try {
                      const record = await db.table("images").get(img.path);
                      if (record?.blob) {
                        (e.target as HTMLImageElement).src =
                          URL.createObjectURL(record.blob);
                      }
                    } catch (error) {
                      console.error("Failed fallback:", error);
                    }
                  })();
                }}
              />
              <div className="flex justify-between">
                <div className="flex-1">
                  <p className="truncate text-sm font-medium text-gray-700">
                    {img.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">{img.path}</p>
                </div>
                <button
                  onClick={() => handleDelete(img.path)}
                  className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
