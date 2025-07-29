import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import { toast } from "@/hooks/use-toast";

interface PostData {
  platform: string;
  caption: string;
  media?: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'scheduling' | 'failed';
}

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    platform: '',
    caption: '',
    media: '',
    scheduledDate: '',
    scheduledTime: ''
  });
  const [date, setDate] = useState<Date>();
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  const validateForm = (): boolean => {
    if (!formData.platform || !formData.caption || !formData.scheduledDate || !formData.scheduledTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    // Check daily limit (max 3 posts per platform per day)
    const savedPosts = localStorage.getItem('scheduledPosts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];
    const postsForDateAndPlatform = posts.filter((post: PostData) => 
      post.platform === formData.platform && 
      post.scheduledDate === formData.scheduledDate
    );

    if (postsForDateAndPlatform.length >= 3) {
      toast({
        title: "Daily Limit Exceeded",
        description: `You can only schedule 3 posts per day for ${formData.platform}`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newPost: PostData = {
      ...formData,
      status: 'scheduled'
    };

    // Save to localStorage
    const savedPosts = localStorage.getItem('scheduledPosts');
    const posts = savedPosts ? JSON.parse(savedPosts) : [];
    const updatedPosts = [...posts, { ...newPost, id: Date.now().toString() }];
    localStorage.setItem('scheduledPosts', JSON.stringify(updatedPosts));

    // Simulate API call
    console.log('POST /api/schedule-post', newPost);

    toast({
      title: "Post Scheduled",
      description: `Your ${formData.platform} post has been scheduled successfully`,
    });

    navigate('/dashboard');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, media: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setFormData(prev => ({ 
        ...prev, 
        scheduledDate: format(selectedDate, 'yyyy-MM-dd')
      }));
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
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Create New Post</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Schedule your content across social media platforms</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Post Details</CardTitle>
              <CardDescription className="text-sm">Fill in the details for your scheduled post</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select 
                    value={formData.platform} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caption">Caption *</Label>
                  <Textarea
                    style={{backgroundColor: "#1a1a1a"}}
                    id="caption"
                    placeholder="Write your post caption..."
                    value={formData.caption}
                    onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                    className="min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.caption.length}/2200 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="media">Media Upload</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    {formData.media ? (
                      <div className="space-y-4">
                        <img 
                          src={formData.media} 
                          alt="Preview" 
                          className="max-w-full h-48 object-cover mx-auto rounded"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setFormData(prev => ({ ...prev, media: '' }))}
                        >
                          Remove Image
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                        <div>
                          <Button type="button" variant="secondary" asChild>
                            <label htmlFor="file-upload" className="cursor-pointer">
                              Upload Image/Video
                            </label>
                          </Button>
                          <Input
                            id="file-upload"
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Support for JPG, PNG, MP4, MOV (max 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Scheduled Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          style={{backgroundColor: "#1a1a1a"}}  
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar

                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={(date) => {
                            // Only disable dates before today (not today itself)
                            const today = new Date();
                            today.setHours(0,0,0,0);
                            const d = new Date(date);
                            d.setHours(0,0,0,0);
                            return d < today;
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Scheduled Time *</Label>
                    <Input
                      style={{backgroundColor: "#1a1a1a"}}  
                      id="time"
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1">
                    Schedule Post
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/dashboard">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default CreatePost;