import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface HeaderProps {
  currentView: 'citizen' | 'admin';
  onViewChange: (view: 'citizen' | 'admin') => void;
}

const Header = ({ currentView, onViewChange }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary rounded-lg">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">CityConnect</h1>
              <p className="text-sm text-muted-foreground">Civic Engagement Platform</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={currentView === 'citizen' ? 'default' : 'secondary'}
            onClick={() => onViewChange('citizen')}
            className="relative"
          >
            Citizen View
          </Button>
          <Button
            variant={currentView === 'admin' ? 'default' : 'secondary'}
            onClick={() => onViewChange('admin')}
            className="relative"
          >
            Admin Dashboard
            <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
              3
            </Badge>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;