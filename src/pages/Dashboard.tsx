import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, BarChart3, Settings, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { exportToExcel } from "@/utils/excelExport";

interface Post {
  id: string;
  platform: string;
  caption: string;
  media?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'scheduling' | 'failed';
}

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('scheduledPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Demo posts if none in localStorage
      const demoPosts: Post[] = [
        {
          id: '1',
          platform: 'Instagram',
          caption: 'Check out our new product launch! 🚀',
          media: '',
          scheduledDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), // tomorrow
          scheduledTime: '10:00',
          status: 'scheduled',
        },
        {
          id: '2',
          platform: 'Twitter',
          caption: 'Don’t miss our live Q&A session this Friday!',
          media: '',
          scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), // in 2 days
          scheduledTime: '15:30',
          status: 'scheduling',
        },
        {
          id: '3',
          platform: 'LinkedIn',
          caption: 'We’re hiring! Join our amazing team. #careers',
          media: '',
          scheduledDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10), // in 3 days
          scheduledTime: '09:00',
          status: 'failed',
        },
      ];
      setPosts(demoPosts);
    }
  }, []);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'scheduling': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'default';
    }
  };

  const handleExportClick = () => {
    try {
      const filename = exportToExcel(posts);
      toast({ 
        title: "Export Successful!", 
        description: `Your posts have been exported to ${filename}` 
      });
    } catch (error) {
      toast({ 
        title: "Export Failed", 
        description: "There was an error exporting your posts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const upcomingPosts = posts.filter(post => {
    const postDate = new Date(`${post.scheduledDate}T${post.scheduledTime}`);
    return postDate > new Date();
  }).slice(0, 5);

  // Add state for platform connections
  const [platformConnections, setPlatformConnections] = useState({
    linkedin: true,
    facebook: true,
    twitter: true,
    instagram: true,
  });

  const toggleConnection = (platform) => {
    setPlatformConnections((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  return (
    <div className="min-h-screen bg-[#2E2E2E]">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 text-white">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400">Manage your social media presence</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="rounded-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium text-muted-foreground text-white">Total Posts</p>
                  <p className="text-2xl sm:text-3xl font-bold text-blue-500">{posts.length}</p>
                </div>
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium text-muted-foreground text-white">Scheduled</p>
                  <p className="text-2xl sm:text-3xl font-bold text-success">
                    {posts.filter(p => p.status === 'scheduled').length}
                  </p>
                </div>
                <CalendarIcon className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium text-muted-foreground text-white">Processing</p>
                  <p className="text-2xl sm:text-3xl font-bold text-warning">
                    {posts.filter(p => p.status === 'scheduling').length}
                  </p>
                </div>
                <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-full">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm sm:text-base font-medium text-muted-foreground text-white">Failed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-destructive">
                    {posts.filter(p => p.status === 'failed').length}
                  </p>
                </div>
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-destructive font-bold text-sm sm:text-base">!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 ">
            <Card className="min-h-[400px] sm:min-h-[450px] border-none rounded-2xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="mb-2 sm:mb-0">
                    <CardTitle className="text-lg sm:text-2xl font-extrabold leading-tight text-white">Upcoming Scheduled Posts</CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">Your next {upcomingPosts.length} scheduled posts</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0 dashboard-btn-group">
                    <Button variant="outline" onClick={handleExportClick} className="w-full sm:w-auto mb-2 sm:mb-0">
                      <Download className="mr-2 h-4 w-4" />
                      Export to Excel
                    </Button>
                    <Button asChild className="w-full sm:w-auto font-bold text-base py-3 bg-primary text-primary-foreground rounded-lg shadow-md mb-2 sm:mb-0">
                      <Link to="/create-post"> <Plus className="mr-2 h-4 w-4" /> Create New Post </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No upcoming posts scheduled</p>
                    <Button asChild className="w-full sm:w-auto font-bold text-base py-3 bg-primary text-primary-foreground rounded-lg shadow-md">
                      <Link to="/create-post">Create your first post</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 dashboard-post-list">
                    {upcomingPosts.map((post) => (
                      <div key={post.id} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg" style={{ background: '#2E2E2E' }}>
                        <div className="flex-shrink-0">
                          {post.media ? (
                            <img src={post.media} alt="Post media" className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded" />
                          ) : (
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">No media</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs px-2 py-0.5">{post.platform}</Badge>
                            <Badge variant={getStatusVariant(post.status)} className="text-xs px-2 py-0.5">
                              {post.status}
                            </Badge>
                          </div>
                          <p className="text-sm sm:text-base text-foreground mb-2 line-clamp-2 font-medium">
                            {post.caption}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(`${post.scheduledDate}T${post.scheduledTime}`).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <Card className="bg-[#1a1a1a] rounded-2xl w-full mx-auto">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full" variant="outline">
                  <Link to="/calendar">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    View Calendar
                  </Link>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <Link to="/posts">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Posts
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Social platform connection card */}
            <Card className="bg-[#1a1a1a] rounded-2xl w-full mx-auto">
              <CardHeader>
                <CardTitle>Platform connection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around items-center mb-4 sm:mb-7">
                  {/* Social icons here, e.g. <img src=... /> or <Icon /> */}
                  {/* Replace with your actual icon components or images */}
                  <img src="/src/img/linkedin.png" alt="LinkedIn" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
                  <img src="/src/img/facebook.png" alt="Facebook" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
                  <img src="/src/img/twitter.png"  alt="X"        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
                  <img src="/src/img/instagram.png" alt="Instagram" className="w-12 h-12 sm:w-16 sm:h-16 rounded-full" />
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  <button
                    className={`rounded-full px-2 sm:px-3 py-1 font-semibold text-xs sm:text-sm focus:outline-none transition-colors text-center ${platformConnections.linkedin ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}
                    onClick={() => toggleConnection('linkedin')}
                  >
                    {platformConnections.linkedin ? 'Connected' : 'Disconnected'}
                  </button>
                  <button
                    className={`rounded-full px-2 sm:px-3 py-1 font-semibold text-xs sm:text-sm focus:outline-none transition-colors text-center ${platformConnections.facebook ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}
                    onClick={() => toggleConnection('facebook')}
                  >
                    {platformConnections.facebook ? 'Connected' : 'Disconnected'}
                  </button>
                  <button
                    className={`rounded-full px-2 sm:px-3 py-1 font-semibold text-xs sm:text-sm focus:outline-none transition-colors text-center ${platformConnections.twitter ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}
                    onClick={() => toggleConnection('twitter')}
                  >
                    {platformConnections.twitter ? 'Connected' : 'Disconnected'}
                  </button>
                  <button
                    className={`rounded-full px-2 sm:px-3 py-1 font-semibold text-xs sm:text-sm focus:outline-none transition-colors text-center ${platformConnections.instagram ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'}`}
                    onClick={() => toggleConnection('instagram')}
                  >
                    {platformConnections.instagram ? 'Connected' : 'Disconnected'}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Date card */}
            <Card className="bg-[#1a1a1a] rounded-2xl w-full mx-auto">
              <CardHeader>
                <CardTitle>Current Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <WhatsAppButton />
      {/* Removed dark mode toggle from footer */}
    </div>
  );
};

export default Dashboard;