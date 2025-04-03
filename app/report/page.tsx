"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  MapPin,
  Loader2,
  Leaf,
  Recycle,
  AlertCircle,
  X,
  ImageIcon,
  CheckCircle,
  Trash2,
  Clock,
} from "lucide-react";
import Image from "next/image";

interface LocationData {
  latitude: number;
  longitude: number;
  placeName: string;
}

// Update interface to match API response
interface ValidationResponse {
  is_valid: boolean;
  message: string;
  confidence_score: number;
  waste_types: Array<string | { type: string; confidence: number }> | string;
  severity: string;
  dustbins: any[];
  recyclable_items:
    | Array<string | { type: string; confidence: number }>
    | string;
  time_analysis: {
    time_appears_valid: boolean;
    lighting_condition: string;
    notes: string;
  };
  description_match: {
    matches_image: boolean;
    confidence: number;
    notes: string;
  };
  additional_data: any;
}

type UploadMode = "camera" | "gallery";

export default function ReportPage() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>("camera");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timestamp, setTimestamp] = useState<string>("");

  // Get user's location and set current timestamp
  useEffect(() => {
    // Set current timestamp in ISO format
    setTimestamp(new Date().toISOString());

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              placeName: data.display_name || "Unknown Location",
            });
          } catch (err) {
            setError("Could not fetch location details");
          }
        },
        (err) => {
          setError("Location access denied");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
    }
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      setStream(mediaStream);
      setShowCamera(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Camera access denied or not available");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "waste-image.jpg", {
              type: "image/jpeg",
            });
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setValidationResult(null);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setValidationResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image || !location) return;

    setIsLoading(true);
    setError(null);

    try {
      // Update to use the new API endpoint
      const formData = new FormData();
      formData.append("image", image);
      formData.append("location", `${location.latitude},${location.longitude}`);
      formData.append("description", description);
      formData.append("timestamp", timestamp);

      const response = await fetch("http://127.0.0.1:8000/api/waste/validate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Validation failed");
      }

      const data = await response.json();
      setValidationResult(data);
    } catch (err) {
      setError("Failed to validate waste report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f8f8] to-[#e8f5e9] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-[#e0e0e0]"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#2e7d32] mb-4">
              Report Waste
            </h1>
            <p className="text-[#4a4a4a] max-w-2xl mx-auto">
              Help us keep our environment clean by reporting waste. Use your
              camera to capture images of waste, and our AI will analyze it to
              provide recycling recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-[#4a4a4a]">
                Capture Waste Image
              </label>

              {/* Upload Mode Toggle */}
              <div className="flex justify-center space-x-4 mb-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setUploadMode("camera")}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    uploadMode === "camera"
                      ? "bg-[#2e7d32] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  <span>Camera</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setUploadMode("gallery")}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    uploadMode === "gallery"
                      ? "bg-[#2e7d32] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Gallery</span>
                </motion.button>
              </div>

              <div className="relative">
                {uploadMode === "camera" ? (
                  <>
                    {!showCamera && !previewUrl && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={startCamera}
                        className="border-2 border-dashed border-[#e0e0e0] rounded-lg p-8 text-center cursor-pointer hover:border-[#2e7d32] transition-colors bg-[#f8f8f8]"
                      >
                        <div className="flex flex-col items-center">
                          <Camera className="w-12 h-12 text-[#2e7d32] mb-4" />
                          <p className="text-[#4a4a4a]">Click to open camera</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Take a photo of the waste
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {showCamera && (
                      <div className="relative rounded-lg overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-64 object-cover"
                          style={{ transform: "scaleX(-1)" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          {!stream && (
                            <div className="text-white text-center">
                              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                              <p>Initializing camera...</p>
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-4 right-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={captureImage}
                            className="bg-[#2e7d32] text-white p-3 rounded-full shadow-lg hover:bg-[#1b5e20] transition-colors"
                          >
                            <Camera className="w-6 h-6" />
                          </motion.button>
                        </div>
                        <div className="absolute top-4 right-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={stopCamera}
                            className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {!previewUrl && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-[#e0e0e0] rounded-lg p-8 text-center cursor-pointer hover:border-[#2e7d32] transition-colors bg-[#f8f8f8]"
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        <div className="flex flex-col items-center">
                          <ImageIcon className="w-12 h-12 text-[#2e7d32] mb-4" />
                          <p className="text-[#4a4a4a]">
                            Click to select from gallery
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            PNG, JPG, JPEG (max. 5MB)
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {previewUrl && (
                  <div className="relative rounded-lg overflow-hidden">
                    <Image
                      src={previewUrl}
                      alt="Waste preview"
                      width={800}
                      height={400}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        if (uploadMode === "camera") {
                          startCamera();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      className="absolute bottom-4 right-4 bg-[#2e7d32] text-white p-3 rounded-full shadow-lg hover:bg-[#1b5e20] transition-colors"
                    >
                      {uploadMode === "camera" ? (
                        <Camera className="w-6 h-6" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-[#4a4a4a]">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 p-4 border border-[#e0e0e0] rounded-lg focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent bg-white/50 backdrop-blur-sm"
                placeholder="Add any additional details about the waste..."
              />
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-[#4a4a4a]">
                Location
              </label>
              {location ? (
                <div className="flex items-center space-x-2 text-[#4a4a4a] bg-[#f8f8f8] p-4 rounded-lg">
                  <MapPin className="w-5 h-5 text-[#2e7d32]" />
                  <span>{location.placeName}</span>
                </div>
              ) : (
                <div className="text-[#4a4a4a] bg-[#f8f8f8] p-4 rounded-lg">
                  {error || "Fetching location..."}
                </div>
              )}
            </div>

            {/* Timestamp Section */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-[#4a4a4a]">
                Timestamp
              </label>
              <div className="flex items-center space-x-2 text-[#4a4a4a] bg-[#f8f8f8] p-4 rounded-lg">
                <Clock className="w-5 h-5 text-[#2e7d32]" />
                <span>{new Date(timestamp).toLocaleString()}</span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!image || !location || isLoading}
              className={`w-full py-4 px-6 rounded-lg text-white font-medium shadow-lg ${
                !image || !location || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#2e7d32] hover:bg-[#1b5e20]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Validating...
                </div>
              ) : (
                "Submit Report"
              )}
            </motion.button>
          </form>

          {/* Validation Results */}
          {validationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-8 p-6 rounded-lg border ${
                validationResult.is_valid
                  ? "bg-[#e8f5e9] border-[#c8e6c9]"
                  : "bg-[#fdf2f8] border-[#fbcfe8]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {validationResult.is_valid ? (
                    <CheckCircle className="w-6 h-6 text-[#2e7d32]" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-rose-500" />
                  )}
                  <h2 className="text-2xl font-bold">
                    {validationResult.is_valid ? (
                      <span className="text-[#2e7d32]">Valid Report</span>
                    ) : (
                      <span className="text-rose-500">Invalid Report</span>
                    )}
                  </h2>
                </div>
                {validationResult.is_valid && (
                  <div className="bg-white/70 px-3 py-1 rounded-full">
                    <span className="font-medium">
                      Confidence: {validationResult.confidence_score}%
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-white/50 p-4 rounded-lg">
                  <p className="text-lg">{validationResult.message}</p>
                </div>

                <div className="bg-white/50 p-4 rounded-lg">
                  <h3 className="font-medium text-[#4a4a4a] mb-2">Severity:</h3>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        validationResult.severity === "Clean"
                          ? "bg-green-500"
                          : validationResult.severity === "Low"
                          ? "bg-yellow-400"
                          : validationResult.severity === "Medium"
                          ? "bg-orange-400"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span>{validationResult.severity}</span>
                  </div>
                </div>

                {validationResult.waste_types.length > 0 && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Trash2 className="w-5 h-5 text-[#2e7d32]" />
                      <h3 className="font-medium text-[#4a4a4a]">
                        Waste Types:
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(validationResult.waste_types) ? (
                        validationResult.waste_types.map((type, index) => (
                          <span
                            key={index}
                            className="bg-[#e8f5e9] px-3 py-1 rounded-full text-[#2e7d32]"
                          >
                            {typeof type === "object" ? type.type : type}
                            {typeof type === "object" && type.confidence && (
                              <span className="ml-1 text-xs opacity-75">
                                ({type.confidence}%)
                              </span>
                            )}
                          </span>
                        ))
                      ) : typeof validationResult.waste_types === "string" ? (
                        validationResult.waste_types
                          .split(",")
                          .map((type, index) => (
                            <span
                              key={index}
                              className="bg-[#e8f5e9] px-3 py-1 rounded-full text-[#2e7d32]"
                            >
                              {type.trim()}
                            </span>
                          ))
                      ) : (
                        <span className="bg-[#e8f5e9] px-3 py-1 rounded-full text-[#2e7d32]">
                          {String(validationResult.waste_types)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {validationResult.recyclable_items &&
                  validationResult.recyclable_items.length > 0 && (
                    <div className="bg-white/50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Recycle className="w-5 h-5 text-[#2e7d32]" />
                        <h3 className="font-medium text-[#4a4a4a]">
                          Recyclable Items:
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(validationResult.recyclable_items) ? (
                          validationResult.recyclable_items.map(
                            (item, index) => (
                              <span
                                key={index}
                                className="bg-[#e8f5e9] px-3 py-1 rounded-full text-[#2e7d32]"
                              >
                                {typeof item === "object" ? item.type : item}
                                {typeof item === "object" &&
                                  item.confidence && (
                                    <span className="ml-1 text-xs opacity-75">
                                      ({item.confidence}%)
                                    </span>
                                  )}
                              </span>
                            )
                          )
                        ) : typeof validationResult.recyclable_items ===
                          "string" ? (
                          validationResult.recyclable_items
                            .split(",")
                            .map((item, index) => (
                              <span
                                key={index}
                                className="bg-[#e8f5e9] px-3 py-1 rounded-full text-[#2e7d32]"
                              >
                                {item.trim()}
                              </span>
                            ))
                        ) : (
                          <span className="bg-[#e8f5e9] px-3 py-1 rounded-full text-[#2e7d32]">
                            {String(validationResult.recyclable_items)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-600 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

//now make a
