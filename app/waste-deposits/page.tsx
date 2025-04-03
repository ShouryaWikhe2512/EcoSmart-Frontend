"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Red pin icon configuration
const redPinIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Green pin icon for user location
const greenPinIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Location {
  latitude: number;
  longitude: number;
  placeName: string;
}

interface WasteDump {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: "full" | "empty";
  capacity: number;
  lastUpdated: string;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 12);
  return null;
}

export default function WasteDepositsPage() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [wasteDumps, setWasteDumps] = useState<WasteDump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setUserLocation({
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

  useEffect(() => {
    const fetchWasteDumps = async () => {
      try {
        // for API Call
        const mockDumps: WasteDump[] = [
          {
            id: "1",
            name: "Central India Waste Facility",
            latitude: 20.5937,
            longitude: 78.9629,
            status: "empty",
            capacity: 80,
            lastUpdated: "2024-03-20T10:00:00Z",
          },
          {
            id: "2",
            name: "West India Waste Facility",
            latitude: 19.0824822,
            longitude: 72.7141282,
            status: "empty",
            capacity: 40,
            lastUpdated: "2024-03-20T10:00:00Z",
          },
          // data additon as per the needs
        ];

        setWasteDumps(mockDumps);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch waste dump locations");
        setLoading(false);
      }
    };

    fetchWasteDumps();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <h1 className="text-3xl font-bold text-[#2e7d32] mb-4">
              Find Waste Dump Locations
            </h1>
            {userLocation && (
              <div className="flex items-center space-x-2 text-[#4a4a4a] mb-4">
                <MapPin className="w-5 h-5 text-[#2e7d32]" />
                <span>{userLocation.placeName}</span>
              </div>
            )}
          </div>

          {/* Map Container */}
          <div className="relative h-[500px] w-full">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2e7d32] animate-spin" />
              </div>
            ) : (
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                  <>
                    <ChangeView
                      center={[userLocation.latitude, userLocation.longitude]}
                    />
                    <Marker
                      position={[userLocation.latitude, userLocation.longitude]}
                      icon={greenPinIcon}
                    >
                      <Popup>Your Location</Popup>
                    </Marker>
                  </>
                )}

                {wasteDumps.map((dump) => (
                  <Marker
                    key={dump.id}
                    position={[dump.latitude, dump.longitude]}
                    icon={redPinIcon}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold">{dump.name}</h3>
                        <p>
                          Status: {dump.status === "empty" ? "Empty" : "Full"}
                        </p>
                        <p>Capacity: {dump.capacity}%</p>
                        <p>
                          Last Updated:{" "}
                          {new Date(dump.lastUpdated).toLocaleString()}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
          {/* Waste nearby*/}

          <div className="p-6">
            <h2 className="text-xl font-bold text-[#2e7d32] mb-4">
              Nearby Waste Dumps
            </h2>
            <div className="space-y-4">
              {wasteDumps.map((dump) => (
                <motion.div
                  key={dump.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-[#4a4a4a]">{dump.name}</h3>
                    <p className="text-sm text-gray-500">
                      Capacity: {dump.capacity}%
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      dump.status === "empty"
                        ? "bg-[#e8f5e9] text-[#2e7d32]"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {dump.status === "empty" ? "Empty" : "Full"}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-600 rounded-lg m-6 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
