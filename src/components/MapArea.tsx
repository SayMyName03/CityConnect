import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapArea = () => {
  return (
    <div className="relative w-full h-[70vh] bg-muted rounded-lg border border-border overflow-hidden">
      {/* Map Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
            <p className="text-muted-foreground">Map integration placeholder</p>
          </div>
        </div>
      </div>

      {/* Sample Issue Markers */}
      <div className="absolute top-1/4 left-1/3 p-2 bg-destructive rounded-full shadow-lg animate-pulse">
        <MapPin className="h-4 w-4 text-destructive-foreground" />
      </div>
      <div className="absolute top-2/3 right-1/4 p-2 bg-warning rounded-full shadow-lg animate-pulse">
        <MapPin className="h-4 w-4 text-warning-foreground" />
      </div>
      <div className="absolute bottom-1/4 left-1/2 p-2 bg-success rounded-full shadow-lg animate-pulse">
        <MapPin className="h-4 w-4 text-success-foreground" />
      </div>

      {/* Location Button */}
      <Button
        size="sm"
        className="absolute top-4 right-4 bg-card shadow-lg border border-border"
        variant="secondary"
      >
        <Navigation className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MapArea;