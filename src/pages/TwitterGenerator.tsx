
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Twitter, Heart, MessageCircle, Repeat2, Share, Upload, MoreHorizontal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TwitterGenerator = () => {
  const [formData, setFormData] = useState({
    username: 'john_doe',
    displayName: 'John Doe',
    tweet: 'Just had an amazing day! The weather is perfect ☀️ #beautiful #day',
    time: '2h',
    likes: '1.2K',
    retweets: '234',
    replies: '56',
    isVerified: false
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your Twitter post screenshot is being generated...",
    });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Twitter className="h-10 w-10 text-blue-500" />
            Twitter Post Generator
          </h1>
          <p className="text-xl text-gray-600">Create realistic Twitter post screenshots</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tweet Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="tweet">Tweet Content</Label>
                <Textarea
                  id="tweet"
                  rows={4}
                  value={formData.tweet}
                  onChange={(e) => setFormData({...formData, tweet: e.target.value})}
                />
              </div>
              
              <div>
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  {profilePhoto && (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="likes">Likes</Label>
                  <Input
                    id="likes"
                    value={formData.likes}
                    onChange={(e) => setFormData({...formData, likes: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="retweets">Retweets</Label>
                  <Input
                    id="retweets"
                    value={formData.retweets}
                    onChange={(e) => setFormData({...formData, retweets: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="replies">Replies</Label>
                  <Input
                    id="replies"
                    value={formData.replies}
                    onChange={(e) => setFormData({...formData, replies: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                />
                <Label htmlFor="verified">Verified Account</Label>
              </div>
              
              <Button onClick={handleDownload} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Screenshot
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-lg border border-gray-200 shadow-lg max-w-lg mx-auto">
                {/* Twitter Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <Twitter className="w-5 h-5 text-blue-500" />
                  <div className="w-12"></div>
                </div>
                
                {/* Tweet Content */}
                <div className="p-4">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-300">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-400"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{formData.displayName}</span>
                        {formData.isVerified && (
                          <svg className="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                          </svg>
                        )}
                        <span className="text-gray-500">@{formData.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{formData.time}</span>
                        <div className="ml-auto">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="text-gray-900 mb-3 leading-relaxed text-[15px]">
                        {formData.tweet}
                      </div>
                      
                      <div className="flex items-center justify-between text-gray-500 max-w-md">
                        <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer group">
                          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{formData.replies}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer group">
                          <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                            <Repeat2 className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{formData.retweets}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer group">
                          <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                            <Heart className="h-4 w-4" />
                          </div>
                          <span className="text-sm">{formData.likes}</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer group">
                          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <Share className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TwitterGenerator;
