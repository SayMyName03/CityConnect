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
      title: "Pothole near Silk Board Junction",
      category: "pothole",
      description:
        "Large pothole at the approach to Silk Board causing two-wheeler swerves and slowing traffic during peak hours.",
      location: "Silk Board Junction, HSR Layout, Bengaluru",
      status: "Reported",
      upvotes: 12,
      reportedAt: "2024-12-02",
      photo: samplePothole,
    },
    {
      id: 2,
      title: "Streetlight outage on 80 Feet Road (Indiranagar)",
      category: "streetlight",
      description:
        "Multiple poles not working between CMH Road junction and 12th Main. Area is very dim after 7 pm.",
      location: "80 Feet Road, Indiranagar, Bengaluru",
      status: "In Progress",
      upvotes: 8,
      reportedAt: "2024-12-01",
      photo: sampleStreetlight,
    },
    {
      id: 3,
      title: "Overflowing garbage near KR Market",
      category: "garbage",
      description:
        "Bins overflowing onto the footpath; stray dogs tearing bags. Needs more frequent BBMP pickup on weekends.",
      location: "KR Market, Chickpete, Bengaluru",
      status: "Resolved",
      upvotes: 15,
      reportedAt: "2024-11-29",
      photo: sampleGarbage,
    },
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