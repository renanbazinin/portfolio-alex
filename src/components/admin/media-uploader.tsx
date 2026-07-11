"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/avif";
const MAX_SIZE = 8 * 1024 * 1024;

async function uploadFile(file: File): Promise<string> {
  if (file.size > MAX_SIZE) {
    throw new Error(`"${file.name}" exceeds the 8 MB limit`);
  }
  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
  });
  return blob.url;
}

export function MediaUploader({
  label,
  multiple = false,
  value,
  onChange,
}: {
  label: string;
  multiple?: boolean;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingNames, setPendingNames] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const uploading = pendingNames.length > 0;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0 || uploading) return;
    const list = multiple ? Array.from(files) : [files[0]];
    setPendingNames(list.map((f) => f.name));

    // Upload concurrently; successes keep the original selection order.
    const results = await Promise.allSettled(list.map(uploadFile));

    const urls: string[] = [];
    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        urls.push(result.value);
      } else {
        const reason = result.reason;
        toast.error(
          reason instanceof Error
            ? reason.message
            : `Failed to upload "${list[i].name}"`,
        );
      }
    });

    if (urls.length > 0) {
      onChange(multiple ? [...value, ...urls] : [urls[0]]);
      toast.success(
        urls.length > 1 ? `${urls.length} images uploaded` : "Image uploaded",
      );
    }

    setPendingNames([]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {uploading ? (
          <span className="text-muted-foreground text-xs">
            Uploading {pendingNames.length}…
          </span>
        ) : null}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-lg border border-dashed p-4 text-center transition-colors ${
          dragOver ? "border-primary bg-accent" : "border-border"
        }`}
      >
        <p className="text-muted-foreground text-sm">
          Drag & drop or
          <button
            type="button"
            className="text-primary mx-1 underline underline-offset-4"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            browse
          </button>
          {multiple ? "images" : "an image"}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          PNG, JPG, WEBP, GIF, AVIF · up to 8 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {value.length > 0 || pendingNames.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group border-border relative h-20 w-28 overflow-hidden rounded border"
            >
              <Image
                src={url}
                alt=""
                width={224}
                height={160}
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 px-2 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeAt(i)}
              >
                ✕
              </Button>
            </div>
          ))}
          {pendingNames.map((name) => (
            <div
              key={name}
              className="border-border bg-muted flex h-20 w-28 flex-col items-center justify-center gap-1 rounded border px-2"
              aria-label={`Uploading ${name}`}
            >
              <Loader2 className="text-muted-foreground size-4 animate-spin" />
              <span className="text-muted-foreground w-full truncate text-center text-[10px]">
                {name}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
