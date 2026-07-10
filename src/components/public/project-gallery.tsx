"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Reveal } from "@/components/motion/reveal";

/** Image sequence with per-image scroll reveal and a dialog lightbox. */
export function ProjectGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {images.map((src, i) => (
          <Reveal key={`${src}-${i}`}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${title} full size`}
              className="group bg-muted block w-full cursor-zoom-in overflow-hidden rounded-lg"
            >
              <Image
                src={src}
                alt={`${title} image ${i + 1}`}
                width={1200}
                height={900}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
              />
            </button>
          </Reveal>
        ))}
      </div>

      <Dialog
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      >
        <DialogContent className="bg-background w-auto max-w-[96vw] p-2 sm:max-w-[min(96vw,80rem)]">
          <DialogTitle className="sr-only">
            {title} — enlarged image
          </DialogTitle>
          {active !== null && images[active] ? (
            <Image
              src={images[active]}
              alt={`${title} image ${active + 1}, enlarged`}
              width={1920}
              height={1440}
              sizes="96vw"
              className="max-h-[85vh] w-auto rounded-md object-contain"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
