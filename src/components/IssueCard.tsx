import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, MapPin, Calendar, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Issue {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  status: 'Reported' | 'In Progress' | 'Resolved';
  upvotes: number;
  reportedAt: string;
  photo?: string;
}

interface IssueCardProps {
  issue: Issue;
  isAdmin?: boolean;
  onStatusChange?: (id: number, status: string) => void;
  onUpvote?: (id: number) => void;
}

const IssueCard = ({ issue, isAdmin = false, onStatusChange, onUpvote }: IssueCardProps) => {
  const [isUpvoted, setIsUpvoted] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported':
        return 'bg-destructive text-destructive-foreground';
      case 'In Progress':
        return 'bg-warning text-warning-foreground';
      case 'Resolved':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    // You could add specific icons for each category
    return '🔧';
  };

  const handleUpvote = () => {
    if (onUpvote) {
      onUpvote(issue.id);
      setIsUpvoted(!isUpvoted);
    }
  };

  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      {issue.photo && (
        <div className="aspect-video overflow-hidden rounded-t-lg">
          <img 
            src={issue.photo} 
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 text-foreground">
              {issue.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs">{getCategoryIcon(issue.category)}</span>
              <span className="text-xs text-muted-foreground capitalize">{issue.category}</span>
            </div>
          </div>
          <Badge className={cn("text-xs", getStatusColor(issue.status))}>
            {issue.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {issue.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{issue.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{issue.reportedAt}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={isUpvoted ? "default" : "outline"}
            size="sm"
            onClick={handleUpvote}
            disabled={isAdmin}
            className="h-8 px-3"
          >
            <ChevronUp className="h-3 w-3 mr-1" />
            <span className="text-xs">{issue.upvotes + (isUpvoted ? 1 : 0)}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Eye className="h-3 w-3" />
          </Button>
        </div>

        {isAdmin && onStatusChange && (
          <Select 
            value={issue.status} 
            onValueChange={(value) => onStatusChange(issue.id, value)}
          >
            <SelectTrigger className="w-32 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Reported">Reported</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardFooter>
    </Card>
  );
};

export default IssueCard;