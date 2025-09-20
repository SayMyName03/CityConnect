import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, MapPin, Grid3X3, BarChart3, Filter, TrendingUp, Users, AlertCircle, CheckCircle, Clock } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  
  const queryClient = useQueryClient();
  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const res = await listIssues();
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
        locality: it.locality?.name || 'Unknown Area',
        _raw: it,
      })) as (Issue & { _raw: any; locality: string })[];
    },
  });

  // Calculate statistics
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(issue => issue.status === 'resolved').length;
  const inProgressIssues = issues.filter(issue => issue.status === 'inProgress').length;
  const openIssues = issues.filter(issue => issue.status === 'open').length;
  
  // Get unique areas
  const areas = ['all', ...new Set(issues.map(issue => issue.locality))];
  
  // Filter issues based on selected filters
  const filteredIssues = issues.filter(issue => {
    const categoryMatch = filterCategory === 'all' || issue.category === filterCategory;
    const areaMatch = selectedArea === 'all' || issue.locality === selectedArea;
    return categoryMatch && areaMatch;
  });

  const categories = ['all', 'pothole', 'garbage', 'lighting', 'water', 'other'];

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
      let localityId: string | undefined = undefined;
      try {
        const coordsMatch = (newIssue.location || '').split(',').map((p: string) => p.trim());
        if (coordsMatch.length === 2 && !isNaN(Number(coordsMatch[0])) && !isNaN(Number(coordsMatch[1]))) {
          const lat = Number(coordsMatch[0]);
          const lng = Number(coordsMatch[1]);
          const localities = await listLocalities();
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
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView} 
      />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'citizen' ? (
          <div className="space-y-8">
            {/* View Toggle and Filters */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Community Issues
                </h2>
                <div className="flex rounded-md shadow-sm" role="group">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                      viewMode === 'map' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setViewMode('map')}
                  >
                    <MapPin className="h-4 w-4 inline mr-1" /> Map View
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                      viewMode === 'grid' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4 inline mr-1" /> Grid View
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select 
                    className="rounded-md border-gray-300 shadow-sm py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <select 
                    className="rounded-md border-gray-300 shadow-sm py-2 px-3 text-sm focus:ring-blue-500 focus:border-blue-500"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                  >
                    {areas.map(area => (
                      <option key={area} value={area}>
                        {area === 'all' ? 'All Areas' : area}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Statistics Dashboard - Show in both views but more prominent in grid */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Community Statistics
                </h3>
                <div className="text-sm text-gray-500">
                  {filteredIssues.length} issues match your filters
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{totalIssues}</p>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-gray-900">{resolvedIssues}</p>
                    <p className="text-xs text-gray-500">
                      {totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0}% success rate
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-yellow-100 p-3 mr-4">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{inProgressIssues}</p>
                  </div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 flex items-center">
                  <div className="rounded-full bg-red-100 p-3 mr-4">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Community Engagement</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {issues.reduce((total, issue) => total + issue.upvotes, 0)}
                    </p>
                    <p className="text-xs text-gray-500">Total upvotes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map and Issues Section */}
            {viewMode === 'map' ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-md p-4 h-96">
                    <MapArea issues={issues} />
                  </div>
                </div>
                <div className="space-y-4 overflow-y-auto max-h-96">
                  <div className="text-sm text-gray-500 mb-2">
                    {filteredIssues.length} issues found
                  </div>
                  {isLoading && <div className="text-center py-4">Loading issues...</div>}
                  {filteredIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      issue={issue}
                      onUpvote={handleUpvote}
                      compact={true}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Area-wise breakdown */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues by Area</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {areas.filter(a => a !== 'all').map(area => {
                      const areaIssues = issues.filter(issue => issue.locality === area);
                      const resolved = areaIssues.filter(issue => issue.status === 'resolved').length;
                      return (
                        <div 
                          key={area} 
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedArea === area 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedArea(area === selectedArea ? 'all' : area)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-gray-900">{area}</h4>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                              {areaIssues.length}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${areaIssues.length > 0 ? (resolved / areaIssues.length) * 100 : 0}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {resolved} of {areaIssues.length} resolved
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Issues Grid */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
                    <div className="text-sm text-gray-500">
                      Showing {filteredIssues.length} of {issues.length} issues
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading && (
                      <div className="col-span-full text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading issues...</p>
                      </div>
                    )}
                    
                    {filteredIssues.length === 0 && !isLoading && (
                      <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
                        <p className="text-gray-500">
                          Try changing your filters or be the first to report an issue in this area.
                        </p>
                      </div>
                    )}
                    
                    {filteredIssues.map((issue) => (
                      <IssueCard
                        key={issue.id}
                        issue={issue}
                        onUpvote={handleUpvote}
                        detailed={true}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AdminDashboard 
            issues={issues as Issue[]}
            onStatusChange={handleStatusChange}
          />
        )}
      </main>

      {/* Floating Report Button */}
      {currentView === 'citizen' && (
        <Button
          onClick={() => setIsReportModalOpen(true)}
          className="fixed bottom-8 right-8 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 bg-blue-600 hover:bg-blue-700"
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

