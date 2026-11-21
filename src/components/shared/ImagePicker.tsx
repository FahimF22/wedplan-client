"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "./UserAvatar";
import { Button } from "@/components/ui/button";

/** Single profile-photo picker with preview (upload happens on submit). */
export function AvatarPicker({
  file,
  onChange,
  currentUrl,
  name,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  currentUrl?: string | null;
  name?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const pick = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image file (JPG, PNG or WEBP)");
    if (f.size > 5 * 1024 * 1024) return toast.error("Image must be 5MB or smaller");
    onChange(f);
  };

  return (
    <div className="flex items-center gap-4">
      <UserAvatar name={name || "You"} image={preview ?? currentUrl} className="size-16 text-lg" />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => inputRef.current?.click()}>
          <ImagePlus /> {preview || currentUrl ? "Change photo" : "Upload photo"}
        </Button>
        {file ? (
          <Button type="button" variant="ghost" onClick={() => onChange(null)}>
            <X /> Remove
          </Button>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
