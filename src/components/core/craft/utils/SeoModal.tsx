"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

type SeoData = {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: "summary" | "summary_large_image";
  author: string;
  canonicalUrl: string;
  robots: string;
};

type SeoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (seoData: SeoData) => void;
};

export const SeoModal: React.FC<SeoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [seo, setSeo] = useState<SeoData>({
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogUrl: "",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
    twitterCard: "summary_large_image",
    author: "",
    canonicalUrl: "",
    robots: "index, follow",
  });

  const handleChange = (field: keyof SeoData, value: string) => {
    setSeo((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // defaults for OpenGraph/Twitter if empty
    const finalSeo = {
      ...seo,
      ogTitle: seo.ogTitle || seo.title,
      ogDescription: seo.ogDescription || seo.description,
      twitterTitle: seo.twitterTitle || seo.title,
      twitterDescription: seo.twitterDescription || seo.description,
    };
    onSubmit(finalSeo);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-6 text-lg font-semibold text-gray-800">
              SEO Settings
            </h2>

            <div className="space-y-6">
              {/* BASIC */}
              <section>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Basic
                </h3>
                <input
                  type="text"
                  placeholder="Title"
                  value={seo.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                />
                <textarea
                  placeholder="Description"
                  value={seo.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Keywords (comma-separated)"
                  value={seo.keywords}
                  onChange={(e) => handleChange("keywords", e.target.value)}
                  className="w-full rounded-md border p-2 text-sm"
                />
              </section>

              {/* OPEN GRAPH */}
              <section>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Open Graph
                </h3>
                <input
                  type="text"
                  placeholder="OG Title"
                  value={seo.ogTitle}
                  onChange={(e) => handleChange("ogTitle", e.target.value)}
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                />
                <textarea
                  placeholder="OG Description"
                  value={seo.ogDescription}
                  onChange={(e) =>
                    handleChange("ogDescription", e.target.value)
                  }
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="OG Image URL"
                  value={seo.ogImage}
                  onChange={(e) => handleChange("ogImage", e.target.value)}
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="OG URL"
                  value={seo.ogUrl}
                  onChange={(e) => handleChange("ogUrl", e.target.value)}
                  className="w-full rounded-md border p-2 text-sm"
                />
              </section>

              {/* TWITTER */}
              <section>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Twitter
                </h3>
                <select
                  value={seo.twitterCard}
                  onChange={(e) =>
                    handleChange(
                      "twitterCard",
                      e.target.value as SeoData["twitterCard"],
                    )
                  }
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">
                    Summary Large Image
                  </option>
                </select>
                <input
                  type="text"
                  placeholder="Twitter Title"
                  value={seo.twitterTitle}
                  onChange={(e) => handleChange("twitterTitle", e.target.value)}
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                />
                <textarea
                  placeholder="Twitter Description"
                  value={seo.twitterDescription}
                  onChange={(e) =>
                    handleChange("twitterDescription", e.target.value)
                  }
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                  rows={2}
                />
                <input
                  type="text"
                  placeholder="Twitter Image URL"
                  value={seo.twitterImage}
                  onChange={(e) => handleChange("twitterImage", e.target.value)}
                  className="w-full rounded-md border p-2 text-sm"
                />
              </section>

              {/* EXTRAS */}
              <section>
                <h3 className="mb-2 text-sm font-medium text-gray-700">
                  Extra
                </h3>
                <input
                  type="text"
                  placeholder="Author / Organization"
                  value={seo.author}
                  onChange={(e) => handleChange("author", e.target.value)}
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Canonical URL"
                  value={seo.canonicalUrl}
                  onChange={(e) => handleChange("canonicalUrl", e.target.value)}
                  className="mb-2 w-full rounded-md border p-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Robots (e.g. index, follow)"
                  value={seo.robots}
                  onChange={(e) => handleChange("robots", e.target.value)}
                  className="w-full rounded-md border p-2 text-sm"
                />
              </section>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save & Export
              </button>
            </div>

            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-200/80 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
