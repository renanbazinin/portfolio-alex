"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
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
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = multiple ? Array.from(files) : [files[0]];
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of list) {
        urls.push(await uploadFile(f));
      }
      onChange(multiple ? [...value, ...urls] : [urls[0]]);
      toast.success(urls.length > 1 ? `${urls.length} images uploaded` : "Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {uploading ? (
          <span className="text-muted-foreground text-xs">Uploading…</span>
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

      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group border-border relative h-20 w-28 overflow-hidden rounded border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
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
        </div>
      ) : null}
    </div>
  );
}
