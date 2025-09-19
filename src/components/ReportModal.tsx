import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: any) => void;
}

const ReportModal = ({ isOpen, onClose, onSubmit }: ReportModalProps) => {
  const [formData, setFormData] = useState({
    photo: null as File | null,
    location: "",
    category: "",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newIssue = {
      id: Date.now(),
      title: `${formData.category} - ${formData.description.substring(0, 30)}...`,
      category: formData.category,
      description: formData.description,
      location: formData.location || "Auto-detected location",
      status: "Reported",
      upvotes: 0,
      reportedAt: new Date().toLocaleDateString(),
      photo: formData.photo ? URL.createObjectURL(formData.photo) : null
    };

    onSubmit(newIssue);
    toast.success("Issue reported successfully!");
    onClose();
    
    // Reset form
    setFormData({
      photo: null,
      location: "",
      category: "",
      description: ""
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData({ 
            ...formData, 
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` 
          });
          toast.success("Location detected!");
        },
        () => {
          toast.error("Could not get location");
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Report New Issue
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="photo">Upload Photo</Label>
            <div className="mt-1">
              <input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('photo')?.click()}
                className="w-full"
              >
                <Camera className="h-4 w-4 mr-2" />
                {formData.photo ? formData.photo.name : "Choose Photo"}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="location">GPS Location</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Enter address or coordinates"
              />
              <Button type="button" variant="outline" onClick={getLocation}>
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="waste-management">Waste Management ♻️ (garbage not collected, overflowing bins, illegal dumping)</SelectItem>
                <SelectItem value="water-issues">Water Issues 💧 (leakage, shortage, contamination, drainage problems)</SelectItem>
                <SelectItem value="air-quality">Air Quality & Pollution 🌫️ (burning waste, dust, industrial smoke)</SelectItem>
                <SelectItem value="road-traffic">Road & Traffic 🚦 (potholes, damaged roads, faulty traffic signals, congestion hotspots)</SelectItem>
                <SelectItem value="public-transport">Public Transport 🚌 (bus/train issues, last-mile connectivity, delays)</SelectItem>
                <SelectItem value="street-lighting">Street Lighting & Safety 💡 (dark areas, broken lights, unsafe zones)</SelectItem>
                <SelectItem value="green-spaces">Green Spaces 🌳 (parks maintenance, tree cutting, lack of greenery)</SelectItem>
                <SelectItem value="flooding">Flooding/Waterlogging 🌊 (especially during rains)</SelectItem>
                <SelectItem value="energy-issues">Energy Issues ⚡ (power outage, diesel generator use, renewable gaps)</SelectItem>
                <SelectItem value="other">Other / Miscellaneous 📝</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the issue in detail..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;