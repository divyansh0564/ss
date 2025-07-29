import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Plus, Download } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { format } from "date-fns";
import { exportToExcel } from "@/utils/excelExport";
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

const Calendar = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDatePosts, setSelectedDatePosts] = useState<Post[]>([]);

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
        {
          id: '4',
          platform: 'Instagram',
          caption: 'Behind the scenes: our creative process.',
          media: '',
          scheduledDate: new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10),
          scheduledTime: '13:00',
          status: 'scheduled',
        },
        {
          id: '5',
          platform: 'Twitter',
          caption: 'Weekly tips: How to boost your engagement!',
          media: '',
          scheduledDate: new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10),
          scheduledTime: '11:00',
          status: 'scheduled',
        },
      ];
      setPosts(demoPosts);
    }
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getPostsForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return posts.filter(post => post.scheduledDate === dateString);
  };

  const handleDateClick = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    const datePosts = getPostsForDate(date);
    setSelectedDate(dateString);
    setSelectedDatePosts(datePosts);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleExportClick = () => {
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

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#2E2E2E]">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Calendar View</h1>
          <p className="text-sm sm:text-base text-muted-foreground">View and manage your scheduled posts</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-white text-lg sm:text-xl">{monthYear}</CardTitle>
                <CardDescription className="text-sm">Click on any date to view scheduled posts</CardDescription>
              </div>
              <div className="flex items-center space-x-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleExportClick}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button asChild>
                  <Link to="/create-post">
                    <Plus className="mr-2 h-4 w-4" />
                    New Post
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs sm:text-sm font-medium text-muted-foreground p-1 sm:p-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                const dayPosts = getPostsForDate(day);
                const isPast = day < new Date();
                const isSelected = selectedDate === format(day, 'yyyy-MM-dd');
                return (
                  <div
                    key={index}
                    className={
                      `min-h-[80px] sm:min-h-[110px] p-1 sm:p-2 border rounded-lg sm:rounded-xl cursor-pointer transition-all shadow-sm
                      ${isCurrentMonth ? 'bg-card hover:bg-primary/10' : 'bg-muted/20 text-muted-foreground'}
                      ${isToday ? 'ring-2 ring-primary' : ''}
                      ${isSelected ? 'border-2 border-primary bg-primary/10' : ''}
                      ${isPast && isCurrentMonth ? 'opacity-60' : ''}`
                    }
                    onClick={() => handleDateClick(day)}
                    style={{ boxShadow: isSelected ? '0 0 0 2px var(--primary)' : undefined }}
                  >
                    <div className="flex items-center justify-between mb-1 sm:mb-2">
                      <span className={`text-sm sm:text-base text-white ${isToday ? 'font-bold text-primary' : ''}`}>{day.getDate()}</span>
                      {dayPosts.length > 0 && (
                        <Badge variant="secondary" className="text-xs px-1 sm:px-2 py-0.5 rounded-full bg-gradient-to-r from-primary to-pink-400 text-white">
                          {dayPosts.length}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      {dayPosts.slice(0, 3).map((post, postIndex) => (
                        <div
                          key={postIndex}
                          className={`flex items-center justify-center gap-1 text-l p-1 rounded-lg truncate font-medium text-white
                            ${post.platform === 'Instagram' ? 'bg-pink-100' : ''}
                            ${post.platform === 'Twitter' ? 'bg-blue-100' : ''}
                            ${post.platform === 'LinkedIn' ? 'bg-blue-100' : ''}
                          `}
                        >
                          {post.platform === 'Instagram' && <span className="i-lucide-instagram" />}
                          {post.platform === 'Twitter' && <span className="i-lucide-twitter" />}
                          {post.platform === 'LinkedIn' && <span className="i-lucide-linkedin" />}
                          {post.platform.charAt(0).toUpperCase() + post.platform.slice(1)}
                        </div>
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="text-xs text-muted-foreground">+{dayPosts.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Posts for {selectedDate && new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {selectedDatePosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No posts scheduled for this date</p>
                <Button asChild>
                  <Link to="/create-post">Schedule a Post</Link>
                </Button>
              </div>
            ) : (
              selectedDatePosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {post.media ? (
                          <img 
                            src={post.media} 
                            alt="Post media" 
                            className="w-16 h-16 object-cover rounded" 
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">No media</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{post.platform}</Badge>
                          <Badge variant={post.status === 'scheduled' ? 'default' : post.status === 'failed' ? 'destructive' : 'secondary'}>
                            {post.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {post.scheduledTime}
                          </span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-3">
                          {post.caption}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <WhatsAppButton />
    </div>
  );
};

export default Calendar;