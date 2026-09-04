"use client";

import { useState } from "react";

export default function PhotoGallery({ photos, title }) {
  const [active, setActive] = useState(0);

  return (
    <div className="gallery-shell">
      <div className="gallery-main relative border border-line rounded-sm overflow-hidden bg-bg">
        <img
          src={photos[active]}
          alt={`${title} - foto ${active + 1}`}
          className="w-full aspect-[4/3] object-cover"
        />
        <span className="absolute left-4 bottom-4 rounded-sm bg-bg/85 px-3 py-1.5 text-xs font-bold text-text backdrop-blur-md">
          {String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
        </span>
      </div>
      {photos.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-3">
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat foto ${i + 1}`}
              className={`relative rounded-sm overflow-hidden border transition-all ${
                i === active
                  ? "border-accent opacity-100"
                  : "border-line opacity-45 hover:opacity-100"
              }`}
            >
              <img src={url} alt="" className="w-full aspect-[4/3] object-cover" />
              {i === active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
