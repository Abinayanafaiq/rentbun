"use client";

import { useState } from "react";

export default function PhotoGallery({ photos, title }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="border-[2.5px] border-ink rounded-[22px] overflow-hidden shadow-hard bg-ink/5">
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
              className={`rounded-xl overflow-hidden border-[2.5px] transition-all ${
                i === active
                  ? "border-ink ring-3 ring-teal/50"
                  : "border-ink/30 opacity-60 hover:opacity-100"
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
