import { useState } from "react";
import { ThumbsUp, MessageCircle, Eye, MapPin, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Issue } from "./IssueCard";

interface IssueCardProps {
  issue: Issue & { locality?: string };
  onUpvote: (id: number | string) => void;
  compact?: boolean;
  detailed?: boolean;
}

const IssueCard = ({ issue, onUpvote, compact = false, detailed = false }: IssueCardProps) => {
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(issue.upvotes || 0);

  const handleUpvote = () => {
    if (!upvoted) {
      setUpvoted(true);
      setUpvoteCount(upvoteCount + 1);
      onUpvote(issue.id);
    }
  };

  const statusColors = {
    open: "bg-blue-100 text-blue-800",
    inProgress: "bg-yellow-100 text-yellow-800",
    resolved: "bg-green-100 text-green-800",
  };

  const categoryIcons = {
    pothole: "🕳️",
    garbage: "🗑️",
    lighting: "💡",
    water: "💧",
    other: "❓",
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 text-sm truncate">{issue.title}</h4>
            <p className="text-xs text-gray-500 mt-1">{issue.locality}</p>
          </div>
          <Badge className={`text-xs ${statusColors[issue.status]}`}>
            {issue.status}
          </Badge>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1" />
            {issue.reportedAt}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 text-xs ${upvoted ? 'text-blue-600' : 'text-gray-500'}`}
            onClick={handleUpvote}
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            {upvoteCount}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {issue.photo && (
        <div className="h-48 overflow-hidden">
          <img 
            src={issue.photo} 
            alt={issue.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <span className="text-2xl mr-2">{categoryIcons[issue.category as keyof typeof categoryIcons] || "❓"}</span>
            <h3 className="font-semibold text-gray-900">{issue.title}</h3>
          </div>
          <Badge className={statusColors[issue.status]}>
            {issue.status}
          </Badge>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {issue.description}
        </p>
        
        {detailed && (
          <>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              {issue.locality}
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4 mr-1" />
              Reported {issue.reportedAt}
            </div>
          </>
        )}
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center ${upvoted ? 'border-blue-300 text-blue-600' : ''}`}
              onClick={handleUpvote}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {upvoteCount}
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              Comment
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;

