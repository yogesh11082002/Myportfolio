"use client";

import { useState, useRef } from "react";
import { UploadCloudIcon, Loader2 } from "lucide-react";
import { uploadDirectToCloudinary } from "@/lib/cloudinary";

interface SimpleCloudinaryUploadProps {
  onSuccess: (result: {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
  }) => void;
  className?: string;
  buttonText?: string;
}

export function SimpleCloudinaryUpload({
  onSuccess,
  className = "",
  buttonText = "Upload Image",
}: SimpleCloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate upload progress since we don't get real-time progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    try {
      // Upload the file
      const result = await uploadDirectToCloudinary(file);

      // Finish the progress bar
      clearInterval(progressInterval);
      setProgress(100);

      // Call the success callback
      onSuccess({
        secure_url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      });
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err instanceof Error ? err.message : "Upload failed");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className={`flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <UploadCloudIcon className="w-5 h-5 mr-2" />
        )}
        {loading ? "Uploading..." : buttonText}
      </button>

      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
          <div
            className="bg-purple-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
          <p className="text-xs text-gray-400 mt-1">Uploading: {progress}%</p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
