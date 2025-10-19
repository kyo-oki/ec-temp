import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  GripVertical,
  Link as LinkIcon,
  Plus,
} from "lucide-react";
import { cn } from "../ui/utils";

export interface ImageUploadProps {
  value: string | string[];
  onChange: (urls: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in MB
  accept?: string[];
  aspectRatio?: number;
  preview?: boolean;
  onUpload?: (file: File) => Promise<string>;
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSize = 5,
  accept = ["image/jpeg", "image/png", "image/webp", "image/gif"],
  aspectRatio,
  preview = true,
  onUpload,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const images = Array.isArray(value) ? value : value ? [value] : [];
  const isMultiple = multiple || Array.isArray(value);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);
      setUploading(true);
      setUploadProgress(0);

      try {
        const filesToUpload = acceptedFiles.slice(0, maxFiles - images.length);

        if (filesToUpload.length === 0) {
          setError(`Maximum ${maxFiles} files allowed`);
          setUploading(false);
          return;
        }

        const uploadPromises = filesToUpload.map(async (file, index) => {
          // Validate file size
          if (file.size > maxSize * 1024 * 1024) {
            throw new Error(
              `File ${file.name} is too large. Maximum size is ${maxSize}MB.`
            );
          }

          // Validate file type
          if (!accept.includes(file.type)) {
            throw new Error(`File ${file.name} is not a supported image type.`);
          }

          // Simulate upload progress
          const progressInterval = setInterval(() => {
            setUploadProgress((prev) => Math.min(prev + 10, 90));
          }, 100);

          try {
            let url: string;

            if (onUpload) {
              url = await onUpload(file);
            } else {
              // Mock upload - in real implementation, this would upload to your server
              await new Promise((resolve) => setTimeout(resolve, 1000));
              url = URL.createObjectURL(file);
            }

            clearInterval(progressInterval);
            setUploadProgress(100);

            return url;
          } catch (error) {
            clearInterval(progressInterval);
            throw error;
          }
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        if (isMultiple) {
          const newImages = [...images, ...uploadedUrls];
          onChange(newImages);
        } else {
          onChange(uploadedUrls[0]);
        }

        setUploadProgress(0);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [images, maxFiles, maxSize, accept, isMultiple, onChange, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: isMultiple,
    disabled: uploading || images.length >= maxFiles,
  });

  const addImageUrl = () => {
    if (!urlInput.trim()) return;

    // Basic URL validation
    try {
      new URL(urlInput);
      if (isMultiple) {
        const newImages = [...images, urlInput];
        onChange(newImages);
      } else {
        onChange(urlInput);
      }
      setUrlInput("");
      setShowUrlInput(false);
      setError(null);
    } catch {
      setError("Please enter a valid URL");
    }
  };

  const removeImage = (index: number) => {
    if (isMultiple) {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    } else {
      onChange("");
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (!isMultiple) return;

    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          isDragActive && "border-blue-500 bg-blue-50",
          uploading && "border-gray-300 cursor-not-allowed",
          images.length >= maxFiles && "border-gray-300 cursor-not-allowed",
          "hover:border-gray-400"
        )}
      >
        <CardContent className="p-6 text-center">
          <input {...getInputProps()} />

          {uploading ? (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-blue-600 animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading...</p>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isDragActive
                    ? "Drop images here"
                    : images.length >= maxFiles
                      ? `Maximum ${maxFiles} files reached`
                      : "Drag & drop images here, or click to select"}
                </p>
                <p className="text-xs text-gray-500">
                  {accept
                    .map((type) => type.split("/")[1])
                    .join(", ")
                    .toUpperCase()}{" "}
                  up to {maxSize}MB
                </p>
                {isMultiple && (
                  <p className="text-xs text-gray-500">
                    {images.length} of {maxFiles} files selected
                  </p>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading || images.length >= maxFiles}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Add URL
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* URL Input */}
      {showUrlInput && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Label htmlFor="image-url">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image-url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addImageUrl();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addImageUrl}
                  disabled={!urlInput.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowUrlInput(false);
                    setUrlInput("");
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Enter the full URL of an image (e.g.,
                https://example.com/image.jpg)
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Image Previews */}
      {preview && images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">
            {isMultiple ? "Uploaded Images" : "Uploaded Image"}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
                style={{
                  aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
                }}
              >
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2 transition-opacity duration-200">
                    {isMultiple && images.length > 1 && (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (index > 0) moveImage(index, index - 1);
                          }}
                          disabled={index === 0}
                        >
                          <GripVertical className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (index < images.length - 1)
                              moveImage(index, index + 1);
                          }}
                          disabled={index === images.length - 1}
                        >
                          <GripVertical className="w-4 h-4 rotate-90" />
                        </Button>
                      </>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Upload success indicator */}
                {uploading && index === images.length - 1 && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
