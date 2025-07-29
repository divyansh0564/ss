import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, Clock, Search, Download, ArrowLeft } from "lucide-react";
import { exportToExcel } from "@/utils/excelExport";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { toast } from "@/hooks/use-toast";

interface Post {
  id: string;
  platform: string;
  caption: string;
  media?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'scheduling' | 'failed';
}

const PostManagement = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; postId: string | null }>({ 
    open: false, 
    postId: null 
  });

  useEffect(() => {
    const savedPosts = localStorage.getItem('scheduledPosts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      setPosts(parsedPosts);
      setFilteredPosts(parsedPosts);
    } else {
      // Demo posts if none in localStorage
      const demoPosts: Post[] = Array.from({ length: 10 }, (_, i) => ({
        id: (i + 1).toString(),
        platform: ['Instagram', 'Twitter', 'LinkedIn'][i % 3],
        caption: `Demo post caption #${i + 1}`,
        media: '',
        scheduledDate: new Date(Date.now() + (i + 1) * 86400000).toISOString().slice(0, 10),
        scheduledTime: `${10 + (i % 8)}:00`,
        status: ['scheduled', 'scheduling', 'failed'][i % 3] as 'scheduled' | 'scheduling' | 'failed',
      }));
      setPosts(demoPosts);
      setFilteredPosts(demoPosts);
    }
  }, []);

  useEffect(() => {
    let filtered = posts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by platform
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(post => post.platform === filterPlatform);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(post => post.status === filterStatus);
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, filterPlatform, filterStatus]);

  const handleDelete = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));
    setDeleteDialog({ open: false, postId: null });
    
    toast({
      title: "Post Deleted",
      description: "The scheduled post has been deleted successfully",
    });
  };

  const handleReschedule = (postId: string) => {
    // Placeholder for future implementation
    console.log('Reschedule post:', postId);
    toast({
      title: "Reschedule Feature",
      description: "Reschedule functionality will be available soon",
    });
  };

  const handleExport = () => {
    try {
      const filename = exportToExcel(posts);
      toast({
        title: "Export Successful!",
        description: `Your posts have been exported to ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your posts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'scheduling': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'default';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'twitter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'linkedin': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-[#2E2E2E]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 sm:mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Post Management</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Edit, reschedule, and manage your scheduled posts</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>All Posts ({filteredPosts.length})</CardTitle>
                <CardDescription>Manage your scheduled social media posts</CardDescription>
              </div>
              <Button onClick={handleExport} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    style={{backgroundColor: "#1a1a1a", border: "1px solid rgb(49, 49, 49)"}}
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="scheduling">Scheduling</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {posts.length === 0 ? 'No posts scheduled yet' : 'No posts match your filters'}
                </p>
                <Button asChild>
                  <Link to="/create-post">Create Your First Post</Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="transition-shadow hover:shadow-md w-full sm:w-[350px] flex-shrink-0" style={{ border: "1px solid rgb(49, 49, 49)"}}>
                    <CardContent className="p-4 sm:p-6">
                                              <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="flex-shrink-0">
                            {post.media ? (
                              <img 
                                src={post.media} 
                                alt="Post media" 
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg" 
                              />
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-lg flex items-center justify-center bg-[#858585]">
                                <span className="text-muted-foreground text-xs">No media</span>
                              </div>
                            )}
                          </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className={getPlatformColor(post.platform)}>
                              {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                            </Badge>
                            <Badge variant={getStatusVariant(post.status)}>
                              {post.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(`${post.scheduledDate}T${post.scheduledTime}`).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-4 line-clamp-3">
                            {post.caption}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              style={{backgroundColor: "#1a1a1a", border: "1px solid rgb(49, 49, 49)"}}
                              size="sm"
                              variant="outline"
                              onClick={() => handleReschedule(post.id)}
                            >
                              <Clock className="mr-2 h-4 w-4" />
                              Reschedule
                            </Button>
                            <Button
                              style={{backgroundColor: "#1a1a1a", border: "1px solid rgb(49, 49, 49)"}}
                              size="sm"
                              variant="outline"
                              onClick={() => console.log('Edit post:', post.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              style={{backgroundColor: "#1a1a1a", border: "1px solid rgb(49, 49, 49)"}}
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteDialog({ open: true, postId: post.id })}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, postId: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this scheduled post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, postId: null })}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteDialog.postId && handleDelete(deleteDialog.postId)}
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <WhatsAppButton />
    </div>
  );
};

export default PostManagement;