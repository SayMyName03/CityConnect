import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import MapArea from "@/components/MapArea";
import ReportModal from "@/components/ReportModal";
import IssueCard, { Issue } from "@/components/IssueCard";
import AdminDashboard from "@/components/AdminDashboard";
import Chatbot from "@/components/Chatbot";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIssue, listIssues, upvoteIssue, updateIssueStatus, listLocalities } from "@/lib/api";


const Index = () => {
  const [currentView, setCurrentView] = useState<'citizen' | 'admin'>('citizen');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const res = await listIssues();
      // Map API shape to UI Issue type
      return res.map((it) => ({
        id: it._id,
        title: it.title,
        category: (it as any).issueType?.label ?? (it as any).category,
        description: it.description,
        location: it.location,
        status: it.status as Issue['status'],
        upvotes: it.upvotes,
        reportedAt: it.reportedAt ? new Date(it.reportedAt).toLocaleDateString() : '',
        photo: it.photoUrl || undefined,
        _raw: it,
      })) as (Issue & { _raw: any })[];
    },
  });

  const reportMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue reported successfully!');
    },
    onError: (err: any) => toast.error(`Failed to report issue: ${err?.message || err}`),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Issue['status'] }) => updateIssueStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue status updated');
    },
    onError: () => toast.error('Failed to update status'),
  });

  const upvoteMutation = useMutation({
    mutationFn: (id: string) => upvoteIssue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      toast.success('Issue upvoted!');
    },
    onError: () => toast.error('Failed to upvote'),
  });

  const handleReportSubmit = (newIssue: any) => {
    (async () => {
      // try to detect locality from coordinates in newIssue.location
      let localityId: string | undefined = undefined;
      try {
        const coordsMatch = (newIssue.location || '').split(',').map((p: string) => p.trim());
        if (coordsMatch.length === 2 && !isNaN(Number(coordsMatch[0])) && !isNaN(Number(coordsMatch[1]))) {
          const lat = Number(coordsMatch[0]);
          const lng = Number(coordsMatch[1]);
          const localities = await listLocalities();
          // naive nearest match using Euclidean distance (good enough for small areas)
          let best: { id?: string; d?: number } = {};
          localities.forEach((loc: any) => {
            if (loc.coordinates && typeof loc.coordinates.lat === 'number') {
              const d = (lat - loc.coordinates.lat) ** 2 + (lng - loc.coordinates.lng) ** 2;
              if (best.d === undefined || d < best.d) best = { id: loc._id, d };
            }
          });
          if (best.id) localityId = best.id;
        }
      } catch (e) {
        // ignore locality detection errors
        console.warn('Locality detection failed', e);
      }

      reportMutation.mutate({
        title: newIssue.title,
        category: newIssue.category,
        description: newIssue.description,
        location: newIssue.location,
        photoUrl: newIssue.photo ?? undefined,
        locality: localityId,
      });
    })();
  };

  const handleStatusChange = (id: number | string, newStatus: string) => {
    const issue = (issues as any[]).find((it) => it.id === id);
    if (!issue) return;
    statusMutation.mutate({ id: issue._raw._id, status: newStatus as Issue['status'] });
  };

  const handleUpvote = (id: number | string) => {
    const issue = (issues as any[]).find((it) => it.id === id);
    if (!issue) return;
    upvoteMutation.mutate(issue._raw._id);
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
                {isLoading && <div className="text-muted-foreground">Loading issues…</div>}
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
            issues={issues as Issue[]}
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

      {/* Floating Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;