self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  console.log("SW: Intercepting request for:", url.pathname);

  // Only intercept /public/* requests
  if (url.pathname.startsWith("/public/")) {
    event.respondWith(
      (async () => {
        try {
          console.log("SW: Fetching from IndexedDB...");
          const db = await openDB("mydb", 10); // Use new database name
          const tx = db.transaction("images", "readonly");
          const store = tx.objectStore("images");

          // Key should match exactly what's stored: "public/filename.ext"
          const key = url.pathname.substring(1); // Remove leading "/" to get "public/filename.ext"
          console.log("SW: Looking for key:", key);

          const record = await idbGet(store, key);
          console.log("SW: Got record:", record);

          if (record) {
            console.log("SW: Found image in IndexedDB, serving blob");
            return new Response(record.blob, {
              headers: {
                "Content-Type": record.blob.type || "image/png",
                "Cache-Control": "public, max-age=86400",
              },
            });
          }

          console.log(
            "SW: Image not found in IndexedDB, falling back to network",
          );
          // Fallback to network if not found in IDB
          return fetch(event.request);
        } catch (err) {
          console.error("SW: Fetch handler error", err);
          return fetch(event.request);
        }
      })(),
    );
  }
});

// Helper: open IndexedDB
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("images")) {
        // Match your app's object store structure
        db.createObjectStore("images", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
function idbGet(store, key) {
  return new Promise((resolve, reject) => {
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
