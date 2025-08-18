self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  console.log("SW: Intercepting request for:", url.pathname);

  if (url.pathname.startsWith("/public/")) {
    event.respondWith(
      (async () => {
        try {
          console.log("SW: Fetching from IndexedDB...");
          const db = await openDB("mydb", 10);
          const tx = db.transaction("images", "readonly");
          const store = tx.objectStore("images");

          const key = url.pathname.substring(1);
          console.log("SW: Looking for key:", key);

          const record = await idbGet(store, key);
          console.log("SW: Got record:", record);

          if (record && record.base64) {
            console.log("SW: Found image in IndexedDB, serving Base64");

            const base64Data = record.base64;
            const contentType = base64Data.substring(
              5,
              base64Data.indexOf(";"),
            );

            const byteCharacters = atob(
              base64Data.substring(base64Data.indexOf(",") + 1),
            );
            const byteArrays = [];

            for (
              let offset = 0;
              offset < byteCharacters.length;
              offset += 512
            ) {
              const slice = byteCharacters.slice(offset, offset + 512);

              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }

              const byteArray = new Uint8Array(byteNumbers);
              byteArrays.push(byteArray);
            }

            const blob = new Blob(byteArrays, { type: contentType });
            return new Response(blob, {
              headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
              },
            });
          }

          console.log(
            "SW: Image not found in IndexedDB, falling back to network",
          );
          return fetch(event.request);
        } catch (err) {
          console.error("SW: Fetch handler error", err);
          return fetch(event.request);
        }
      })(),
    );
  }
});

function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("images")) {
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
