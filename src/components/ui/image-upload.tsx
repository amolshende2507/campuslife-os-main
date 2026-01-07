import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  folder?: string;
}

export const ImageUpload = ({ onUpload, folder = "events" }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      // 1. Create a preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // 2. Upload to Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('campus-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data } = supabase.storage
        .from('campus-uploads')
        .getPublicUrl(filePath);

      onUpload(data.publicUrl);
      
    } catch (error) {
      console.error("Upload failed", error);
      alert("Error uploading image");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onUpload(""); // Clear parent state
  };

  if (preview) {
    return (
      <div className="relative rounded-xl overflow-hidden border w-full h-40 group">
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        <button
          onClick={removeImage}
          type="button"
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground">
          {uploading ? (
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
          ) : (
            <ImageIcon className="w-8 h-8 mb-2" />
          )}
          <p className="text-sm font-medium">Click to upload image</p>
          <p className="text-xs opacity-70">SVG, PNG, JPG (max 5MB)</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange} 
          disabled={uploading}
        />
      </label>
    </div>
  );
};