import { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";

const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946]; // Bengaluru
const DEFAULT_ZOOM = 12;

const sampleIssues = [
  { id: 1, title: "Pothole - Silk Board", coords: [12.9166, 77.6190], color: "#dc2626" },
  { id: 2, title: "Streetlight - Indiranagar 80 Ft Rd", coords: [12.9719, 77.6412], color: "#ea580c" },
  { id: 3, title: "Garbage - KR Market", coords: [12.9623, 77.5731], color: "#16a34a" },
];

const MapArea = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);
  const [initialised, setInitialised] = useState(false);

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      const map = L.map(containerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);

      // Add sample markers
      sampleIssues.forEach((i) => {
        const m = L.circleMarker(i.coords as [number, number], {
          radius: 8,
          color: i.color,
          fillColor: i.color,
          fillOpacity: 0.9,
          weight: 2,
        })
          .bindPopup(`<strong>${i.title}</strong>`) 
          .addTo(markersLayerRef.current!);
      });

      mapRef.current = map;
      setInitialised(true);
    }
  }, []);

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (mapRef.current) {
          mapRef.current.setView(latlng, Math.max(mapRef.current.getZoom(), 15), { animate: true });
        }
        if (!userMarkerRef.current) {
          userMarkerRef.current = L.circleMarker(latlng, {
            radius: 9,
            color: "#06b6d4",
            fillColor: "#06b6d4",
            fillOpacity: 0.95,
            weight: 2,
          }).addTo(mapRef.current!);
        } else {
          userMarkerRef.current.setLatLng(latlng);
        }
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
    );
  };

  return (
    <div className="relative w-full h-[70vh] rounded-lg border border-border overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute top-4 right-4 z-[400]">
        <Button size="sm" variant="secondary" onClick={locateMe} disabled={!initialised}>
          Locate Me
        </Button>
      </div>
    </div>
  );
};

export default MapArea;