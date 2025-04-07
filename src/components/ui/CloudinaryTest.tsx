"use client";

import { useState, useEffect } from "react";

export function CloudinaryTest() {
  const [config, setConfig] = useState({
    cloudName: "",
    uploadPreset: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    setConfig({
      cloudName: cloudName || "Not set",
      uploadPreset: uploadPreset || "Not set",
    });

    if (!cloudName) {
      setError("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
    } else if (!uploadPreset) {
      setError("Missing NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
    } else {
      setError(null);
    }

    setLoading(false);
  }, []);

  const testDirectUpload = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/cloudinary/test", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Cloudinary test successful: ${JSON.stringify(data)}`);
      } else {
        alert(`Cloudinary test failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Test failed:", error);
      alert(
        `Test failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded-md">
      <h2 className="text-xl font-bold mb-4">Cloudinary Configuration Test</h2>

      <div className="mb-4">
        <p>
          <strong>Cloud Name:</strong> {config.cloudName}
        </p>
        <p>
          <strong>Upload Preset:</strong> {config.uploadPreset}
        </p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={testDirectUpload}
          disabled={loading || !!error}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          Test Cloudinary API
        </button>
      </div>
    </div>
  );
}
