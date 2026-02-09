import { useState, useRef } from "react";
import { logger } from "@/shared/lib/logger";

type Props = {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  children?: React.ReactNode;
};

export default function DragDropUpload({ onUpload, accept = "image/*", multiple = true, maxFiles = 50, children }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    const filesToUpload = files.slice(0, maxFiles);
    await processFiles(filesToUpload);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    await processFiles(files.slice(0, maxFiles));
  };

  const processFiles = async (files: File[]) => {
    setUploading(true);
    try {
      // Create previews
      const urls = await Promise.all(
        files.map((f) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(f);
          });
        })
      );
      setPreviews(urls);

      // Upload
      await onUpload(files);

      // Clear previews after successful upload
      setTimeout(() => setPreviews([]), 2000);
    } catch (error) {
      logger.error("Upload failed", error);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? "border-gold/60 bg-gold/10"
            : uploading
            ? "border-cloud/30 bg-cloud/5"
            : "border-hairline bg-black/20 hover:border-gold/30 hover:bg-gold/5"
        } p-8 text-center`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploading ? (
          <div className="text-cloud">
            <div className="text-[12px] uppercase tracking-luxe">Завантаження...</div>
            {previews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {previews.map((url, i) => (
                  <img key={i} src={url} alt="" className="w-16 h-16 object-cover rounded-lg" />
                ))}
              </div>
            )}
          </div>
        ) : children ? (
          children
        ) : (
          <div>
            <div className="text-[12px] uppercase tracking-luxe text-ash">Перетягни файли сюди</div>
            <div className="mt-2 text-sm text-cloud">або натисни, щоб обрати</div>
            {multiple && <div className="mt-2 text-[11px] text-ash">до {maxFiles} файлів одразу</div>}
          </div>
        )}
      </div>

      {previews.length > 0 && !uploading && (
        <div className="mt-3 text-[11px] text-green-500">✓ Завантажено {previews.length} файл(ів)</div>
      )}
    </div>
  );
}
