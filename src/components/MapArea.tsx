import { useEffect, useRef, useState } from "react";
import L, { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import "@/styles/map.css";
import { Button } from "@/components/ui/button";
import { Crosshair } from "lucide-react";
import { listIssues } from "@/lib/api";
import { useQuery } from '@tanstack/react-query';

const DEFAULT_CENTER: [number, number] = [12.9716, 77.5946]; // Bengaluru
const DEFAULT_ZOOM = 12;

// Color palette by category key (fallback)
const CATEGORY_COLORS: Record<string, string> = {
  'waste-management': '#16a34a',
  'water-issues': '#0ea5e9',
  'air-quality': '#64748b',
  'road-traffic': '#dc2626',
  'public-transport': '#ef4444',
  'street-lighting': '#f59e0b',
  'green-spaces': '#10b981',
  'flooding': '#0369a1',
  'energy-issues': '#8b5cf6',
  'other': '#94a3b8',
};

const MapArea = () => {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);
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

      markersLayerRef.current!.clearLayers();
      // initial markers will be added by the effect below when issues are available

      mapRef.current = map;
      setInitialised(true);
    }

    // Position the map control (GPS) under leaflet zoom controls
    const positionControl = () => {
      const container = containerRef.current;
      const controlEl = controlRef.current;
      if (!container || !controlEl) return;
      // Leaflet places zoom controls inside .leaflet-control-zoom
      const zoomEl = container.querySelector<HTMLDivElement>('.leaflet-control-zoom');
      if (zoomEl) {
        const zoomRect = (zoomEl as HTMLElement).getBoundingClientRect();
        const parentRect = (container as HTMLElement).getBoundingClientRect();
        // compute top relative to map container
        const top = (zoomEl as HTMLElement).offsetTop + (zoomEl as HTMLElement).offsetHeight + 8;
        // compute left so the control sits under zoom controls (left-aligned)
        const left = zoomRect.left - parentRect.left;
        controlEl.style.top = `${top}px`;
        controlEl.style.left = `${Math.max(8, left)}px`;
        // clear right to avoid conflicts
        controlEl.style.right = 'auto';
      } else {
        // fallback
        controlEl.style.top = `12px`;
        controlEl.style.left = `12px`;
        controlEl.style.right = 'auto';
      }
    };

    // run once and on resize
    positionControl();
    window.addEventListener('resize', positionControl);

    // cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      window.removeEventListener('resize', positionControl);
    };
  }, []);

  // Use react-query to keep issues in sync
  const { data: issues = [] } = useQuery({ queryKey: ['issues'], queryFn: listIssues });

  // Update markers whenever issues change
  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();
    issues.forEach((it: any) => {
      let coords: [number, number] | null = null;
      if (it.location && typeof it.location === 'string') {
        const parts = it.location.split(',').map((p: string) => p.trim());
        if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
          coords = [Number(parts[0]), Number(parts[1])];
        }
      }
      if (!coords && it.locality && it.locality.coordinates && typeof it.locality.coordinates.lat === 'number') {
        coords = [it.locality.coordinates.lat, it.locality.coordinates.lng];
      }
      if (!coords) return;
      const categoryKey = (it.issueType && it.issueType.key) || (it.category || 'other');
      const color = CATEGORY_COLORS[categoryKey] || '#2563eb';
      const marker = L.circleMarker(coords as [number, number], {
        radius: 8,
        color,
        fillColor: color,
        fillOpacity: 0.9,
        weight: 2,
      }).addTo(markersLayerRef.current!);
      const label = (it.issueType && it.issueType.label) || (it.category || it.title || 'Issue');
      marker.bindTooltip(label, { permanent: false, direction: 'top', offset: [0, -10] });
      marker.on('mouseover', () => marker.openTooltip());
      marker.on('mouseout', () => marker.closeTooltip());
      marker.on('click', () => marker.bindPopup(`<strong>${it.title}</strong><br/>${label}`).openPopup());
    });
  }, [issues]);

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
      <div ref={containerRef} className="map-container w-full h-full" />
      <div ref={controlRef} className="map-control-fixed">
        <Button size="sm" variant="secondary" onClick={locateMe} disabled={!initialised} className="p-2">
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MapArea;