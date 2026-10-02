import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, X, Loader2, Link2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadThumbnail } from "../../api/upload";
import { resolveMediaUrl } from "../../utils/media";

interface ThumbnailUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ThumbnailUploader({
  value,
  onChange,
  label = "Thumbnail / Cover Image",
}: ThumbnailUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(!value);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WEBP, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size must be under 10MB");
      return;
    }

    try {
      setUploading(true);
      const res = await uploadThumbnail(file);
      onChange(res.url);
      toast.success("Thumbnail uploaded successfully!");
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to upload image";
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-ink/80">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-xs text-moss hover:underline"
        >
          <Link2 className="h-3 w-3" />
          {showUrlInput ? "Hide manual URL" : "Enter image URL instead"}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Preview Card if image already selected/uploaded */}
      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-mist bg-paper-warm p-3 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-mist/80 bg-paper-sand shadow-inner">
              <img
                src={resolveMediaUrl(value)}
                alt="Story Thumbnail Preview"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/cover-about.jpg";
                }}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs font-semibold text-ink truncate">{value}</p>
              <p className="text-[11px] text-ink/50">
                Ready for publication. Will be shown on story cards and header.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-mist bg-white px-3 py-1.5 text-xs font-medium text-ink hover:bg-mist transition shadow-xs"
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-moss" />
                  ) : (
                    <UploadCloud className="h-3.5 w-3.5 text-moss" />
                  )}
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100/80 transition"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
            isDragging
              ? "border-moss bg-moss/5 scale-[0.99]"
              : "border-mist bg-paper-warm/50 hover:border-moss/60 hover:bg-paper-warm"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-xs border border-mist/80 group-hover:scale-105 transition">
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-moss" />
            ) : (
              <UploadCloud className="h-6 w-6 text-moss" />
            )}
          </div>
          <p className="mt-3 text-sm font-medium text-ink">
            {uploading ? "Uploading image..." : "Click or drag & drop to upload thumbnail"}
          </p>
          <p className="mt-1 text-xs text-ink/50">
            JPG, PNG, WEBP, GIF up to 10MB (Stored locally & served instantly)
          </p>
        </div>
      )}

      {/* Manual URL input if toggled */}
      {showUrlInput && (
        <div className="pt-1">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Or paste an image URL (e.g. https://...)"
              className="w-full rounded-lg border border-mist bg-white pl-9 pr-3 py-2 text-xs text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
            />
            <ImageIcon className="absolute left-3 top-2.5 h-3.5 w-3.5 text-ink/40" />
          </div>
        </div>
      )}
    </div>
  );
}
