"use client";

import { useState } from "react";

export default function PhotoGallery({ photos, title }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="border border-line rounded-lg overflow-hidden bg-bg">
        <img
          src={photos[active]}
          alt={`${title} — foto ${active + 1}`}
          className="w-full aspect-[4/3] object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="grid grid-cols-5 gap-2.5 mt-3">
          {photos.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat foto ${i + 1}`}
              className={`rounded overflow-hidden border transition-all ${
                i === active
                  ? "border-accent"
                  : "border-line opacity-60 hover:opacity-100"
              }`}
            >
              <img src={url} alt="" className="w-full aspect-square object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
