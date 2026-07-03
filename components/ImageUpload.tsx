import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  bucket: string;
  onUpload: (url: string) => void;
  currentImage?: string | null;
}

export function ImageUpload({ bucket, onUpload, currentImage }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    onUpload(publicUrl);
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {currentImage && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        variant="outline"
        className="text-[11px] font-mono uppercase tracking-[0.1em]"
      >
        {uploading ? "Uploading..." : currentImage ? "Change image" : "Upload image"}
      </Button>
    </div>
  );
}
