"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage, errorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const MAX = 6;

/** Uploads each picked file to ImgBB (via the API) and returns hosted URLs. First image is the cover. */
export function MultiImageUpload({
  value,
  onChange,
  error,
  onBusyChange,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  error?: string;
  onBusyChange?: (busy: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const room = MAX - value.length;
    const list = Array.from(files).slice(0, room);
    if (files.length > room) toast.warning(`You can add up to ${MAX} images`);

    setUploading(list.length);
    onBusyChange?.(true);
    const urls: string[] = [];
    for (const f of list) {
      try {
        urls.push(await uploadImage(f));
      } catch (err) {
        toast.error(`${f.name}: ${errorMessage(err, "upload failed")}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
    onBusyChange?.(false);
    if (urls.length) {
      onChange([...value, ...urls]);
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
    }
  };

  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const makeCover = (i: number) => onChange([value[i]!, ...value.filter((_, idx) => idx !== i)]);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Service image ${i + 1}`} className="size-full object-cover" />
            {i === 0 ? (
              <span className="absolute left-2 top-2 rounded-full bg-[var(--gold)] px-2 py-0.5 text-[11px] font-semibold text-[var(--gold-foreground)]">
                Cover
              </span>
            ) : (
              <button
                type="button"
                onClick={() => makeCover(i)}
                className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Star className="size-3" /> Make cover
              </button>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Remove image"
              className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-black/55 text-white hover:bg-destructive"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
        {Array.from({ length: uploading }).map((_, i) => (
          <div key={`u${i}`} className="grid aspect-[4/3] place-items-center rounded-xl border bg-muted text-muted-foreground">
            <div className="flex flex-col items-center gap-2 text-xs">
              <Loader2 className="size-5 animate-spin" /> Uploading…
            </div>
          </div>
        ))}
        {value.length + uploading < MAX ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm text-muted-foreground transition hover:border-primary hover:text-primary",
              error && "border-destructive/60",
            )}
          >
            <ImagePlus className="size-6" />
            Add images
            <span className="text-xs">{value.length}/{MAX}</span>
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {error ? <p className="mt-2 text-xs font-medium text-destructive">{error}</p> : (
        <p className="mt-2 text-xs text-muted-foreground">Up to 6 images (JPG, PNG or WEBP, max 5MB each). The first image is used as the cover.</p>
      )}
    </div>
  );
}
