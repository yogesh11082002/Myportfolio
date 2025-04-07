"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloudIcon, Loader2 } from "lucide-react";

declare global {
  interface Window {
    cloudinary: any;
  }
}

interface CloudinaryUploadWidgetProps {
  onSuccess: (result: {
    secure_url: string;
    public_id: string;
    width: number;
    height: number;
  }) => void;
  resourceType?: "image" | "video" | "auto";
  className?: string;
  buttonText?: string;
}

export function CloudinaryUploadWidget({
  onSuccess,
  resourceType = "image",
  className = "",
  buttonText = "Upload Image",
}: CloudinaryUploadWidgetProps) {
  const cloudinaryRef = useRef<any>(null);
  const widgetRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if required env variables are present
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      setError("Missing Cloudinary cloud name");
    } else if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      setError("Missing Cloudinary upload preset");
    } else {
      setError(null);
    }

    // Add Cloudinary widget script if not already loaded
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => {
        // Only initialize the widget after the script has loaded
        initializeWidget();
      };
      document.body.appendChild(script);
    } else {
      // If script is already loaded, initialize immediately
      initializeWidget();
    }

    // Cleanup
    return () => {
      if (widgetRef.current && widgetRef.current.close) {
        widgetRef.current.close();
      }
    };
  }, [onSuccess, resourceType]);

  const initializeWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary script failed to load");
      return;
    }

    // Validate required environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName) {
      console.error(
        "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable"
      );
      setLoading(false);
      return;
    }

    if (!uploadPreset) {
      console.error(
        "Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET environment variable"
      );
      setLoading(false);
      return;
    }

    cloudinaryRef.current = window.cloudinary;

    // Create widget instance
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: cloudName,
        uploadPreset: uploadPreset,
        folder: "portfolio/projects",
        resourceType: resourceType,
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ["image"],
        maxFileSize: 5000000, // 5MB
        styles: {
          palette: {
            window: "#111827",
            windowBorder: "#374151",
            tabIcon: "#8B5CF6",
            menuIcons: "#8B5CF6",
            textDark: "#FFFFFF",
            textLight: "#FFFFFF",
            link: "#8B5CF6",
            action: "#8B5CF6",
            inactiveTabIcon: "#6B7280",
            error: "#EF4444",
            inProgress: "#8B5CF6",
            complete: "#22C55E",
            sourceBg: "#1F2937",
          },
          fonts: {
            default: null,
            "'Inter', sans-serif": {
              url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          onSuccess({
            secure_url: result.info.secure_url,
            public_id: result.info.public_id,
            width: result.info.width,
            height: result.info.height,
          });
          setLoading(false);
        }

        if (error) {
          console.error("Upload error:", error);
          setLoading(false);
        }

        if (result && result.event === "close") {
          setLoading(false);
        }
      }
    );
  };

  const handleUpload = () => {
    setLoading(true);

    // First check if Cloudinary is loaded
    if (!window.cloudinary) {
      console.error("Cloudinary SDK not loaded yet");
      // Try to initialize it again
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      script.onload = () => {
        initializeWidget();
        // Try opening after initialization
        setTimeout(() => {
          if (widgetRef.current) {
            widgetRef.current.open();
          } else {
            setLoading(false);
            console.error("Failed to initialize Cloudinary widget");
          }
        }, 100);
      };
      document.body.appendChild(script);
      return;
    }

    // If widget not created yet, initialize it
    if (!widgetRef.current && cloudinaryRef.current) {
      initializeWidget();
    }

    // Try to open the widget
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      // If widget isn't ready yet, try again after a short delay
      setTimeout(() => {
        // Re-initialize if needed
        if (!widgetRef.current) {
          initializeWidget();
        }

        if (widgetRef.current) {
          widgetRef.current.open();
        } else {
          setLoading(false);
          console.error("Cloudinary widget initialization failed");
        }
      }, 500);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !!error}
        className={`flex items-center justify-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white transition-colors ${
          loading || !!error ? "opacity-70 cursor-not-allowed" : ""
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        ) : (
          <UploadCloudIcon className="w-5 h-5 mr-2" />
        )}
        {loading ? "Uploading..." : error ? "Configuration Error" : buttonText}
      </button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
