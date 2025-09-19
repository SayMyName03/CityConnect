import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import MapArea from "@/components/MapArea";
import ReportModal from "@/components/ReportModal";
import IssueCard, { Issue } from "@/components/IssueCard";
import AdminDashboard from "@/components/AdminDashboard";
import { toast } from "sonner";

// Import sample images
import samplePothole from "@/assets/sample-pothole.jpg";
import sampleStreetlight from "@/assets/sample-streetlight.jpg";
import sampleGarbage from "@/assets/sample-garbage.jpg";

const Index = () => {
  const [currentView, setCurrentView] = useState<'citizen' | 'admin'>('citizen');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      title: "Large Pothole on Main Street",
      category: "pothole",
      description: "Deep pothole near the intersection causing damage to vehicles. Needs immediate attention for safety.",
      location: "Main Street & 5th Ave",
      status: "Reported",
      upvotes: 12,
      reportedAt: "2024-01-15",
      photo: samplePothole
    },
    {
      id: 2,
      title: "Broken Streetlight - Park Avenue",
      category: "streetlight",
      description: "Streetlight has been out for over a week, creating safety concerns for pedestrians in the evening.",
      location: "Park Avenue, Block 200",
      status: "In Progress",
      upvotes: 8,
      reportedAt: "2024-01-12",
      photo: sampleStreetlight
    },
    {
      id: 3,
      title: "Overflowing Garbage Bins",
      category: "garbage",
      description: "Multiple garbage bins overflowing, attracting pests and creating unsanitary conditions.",
      location: "Oak Street Residential Area",
      status: "Resolved",
      upvotes: 15,
      reportedAt: "2024-01-10",
      photo: sampleGarbage
    }
  ]);

  const handleReportSubmit = (newIssue: Issue) => {
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id 
        ? { ...issue, status: newStatus as Issue['status'] }
        : issue
    ));
    toast.success(`Issue status updated to ${newStatus}`);
  };

  const handleUpvote = (id: number) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id 
        ? { ...issue, upvotes: issue.upvotes + 1 }
        : issue
    ));
    toast.success("Issue upvoted!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'citizen' ? (
          <div className="space-y-8">
            {/* Map Section */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Issue Map
              </h2>
              <MapArea />
            </section>

            {/* Issues Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Recent Issues
                </h2>
                <div className="text-sm text-muted-foreground">
                  {issues.length} total issues
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    onUpvote={handleUpvote}
                  />
                ))}
              </div>
            </section>
          </div>
        ) : (
          <AdminDashboard 
            issues={issues}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Floating Report Button - Only show in citizen view */}
      {currentView === 'citizen' && (
        <Button
          onClick={() => setIsReportModalOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
          size="lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default Index;