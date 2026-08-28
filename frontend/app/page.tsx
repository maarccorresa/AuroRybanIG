"use client";

import { useState, useCallback, useEffect } from "react";
import { readMetadata, applyProfile } from "@/lib/api";

type FileKind = "image" | "video" | null;

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileKind, setFileKind] = useState<FileKind>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const detectKind = (file: File): FileKind => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const images = ["jpg", "jpeg", "png", "heic", "tif", "tiff", "webp"];
    const videos = ["mp4", "mov", "avi", "mkv", "3gp", "m4v"];
    if (images.includes(ext)) return "image";
    if (videos.includes(ext)) return "video";
    return null;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    setMetadata(null);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    const kind = detectKind(droppedFile);
    if (!kind) {
      setError("Unsupported file type. Use JPG, PNG, MP4, MOV, etc.");
      return;
    }

    setFile(droppedFile);
    setFileKind(kind);
    setLoading(true);

    try {
      const meta = await readMetadata(droppedFile);
      setMetadata(meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error reading metadata");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setMetadata(null);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const kind = detectKind(selectedFile);
    if (!kind) {
      setError("Unsupported file type");
      return;
    }

    setFile(selectedFile);
    setFileKind(kind);
    setLoading(true);

    try {
      const meta = await readMetadata(selectedFile);
      setMetadata(meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error reading metadata");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApply = useCallback(async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);

    try {
      const blob = await applyProfile(file);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rayban_${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error applying profile");
    } finally {
      setProcessing(false);
    }
  }, [file]);

  const reset = useCallback(() => {
    setFile(null);
    setFileKind(null);
    setMetadata(null);
    setError(null);
    setLoading(false);
    setProcessing(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AutoRayban
          </h1>
          <p className="text-lg text-gray-600">
            Apply Ray-Ban Meta Smart Glasses 2 profile to your photos and videos
          </p>
        </div>

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`dropzone rounded-2xl p-12 text-center cursor-pointer ${
              isDragging ? "active" : ""
            }`}
          >
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v12m0 0v4m0-4H36m-4 12a4 4 0 01-4-4V12a4 4 0 014-4h12a4 4 0 014 4v20a4 4 0 01-4 4m-4-12v4m0 0v4m0-4h4m-4 0H28"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drag & Drop your file here
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supports JPG, PNG, HEIC, MP4, MOV, and more
            </p>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Browse Files
            </label>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  {fileKind === "image" ? (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Reading metadata...</p>
              </div>
            )}

            {metadata && !loading && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
                  Current Metadata
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                    {JSON.stringify(metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <button
              onClick={handleApply}
              disabled={processing || loading}
              className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Apply Ray-Ban Profile & Download
                </>
              )}
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                Profile will be applied:
              </h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Make: Meta AI</li>
                <li>• Model: Ray-Ban Meta Smart Glasses 2</li>
                <li>• Orientation: Horizontal (normal)</li>
                <li>• Resolution: 72x72 DPI</li>
                <li>• Color Space: sRGB</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
