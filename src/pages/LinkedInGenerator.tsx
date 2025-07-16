
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Heart, MessageCircle, Share, MoreHorizontal, Download, Eye, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface LinkedInPost {
  authorName: string;
  authorTitle: string;
  authorImage: string;
  postText: string;
  hashtags: string;
  likes: number;
  comments: number;
  shares: number;
  timeAgo: string;
  postImage?: string;
}

const LinkedInGenerator = () => {
  const [postData, setPostData] = useState<LinkedInPost>({
    authorName: '',
    authorTitle: '',
    authorImage: '',
    postText: '',
    hashtags: '',
    likes: 0,
    comments: 0,
    shares: 0,
    timeAgo: '1h',
    postImage: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateField = (field: keyof LinkedInPost, value: string | number) => {
    setPostData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!postData.authorName || !postData.postText) {
      toast.error('Please fill in author name and post content');
      return;
    }
    setShowPreview(true);
    toast.success('LinkedIn post generated successfully!');
  };

  const handleImageUpload = (type: 'profile' | 'post') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        if (type === 'profile') {
          updateField('authorImage', imageUrl);
        } else {
          updateField('postImage', imageUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const LinkedInPreview = () => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-lg mx-auto">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={postData.authorImage} />
            <AvatarFallback className="bg-blue-600 text-white">
              {postData.authorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {postData.authorName || 'Your Name'}
            </h3>
            <p className="text-xs text-gray-600">
              {postData.authorTitle || 'Your Title'}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>{postData.timeAgo}</span>
              <span>•</span>
              <span>🌍</span>
            </div>
          </div>
        </div>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-wrap">
          {postData.postText || 'Your LinkedIn post content will appear here...'}
        </p>
        {postData.hashtags && (
          <div className="mt-2 flex flex-wrap gap-1">
            {postData.hashtags.split(',').map((tag, index) => (
              <span key={index} className="text-blue-600 text-sm">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Image */}
      {postData.postImage && (
        <div className="px-4 pb-3">
          <img 
            src={postData.postImage} 
            alt="Post content" 
            className="w-full rounded-lg border border-gray-200"
          />
        </div>
      )}

      {/* Engagement Stats */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">👍</span>
              </div>
              <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-2 h-2 text-white fill-white" />
              </div>
              <span>{postData.likes} reactions</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span>{postData.comments} comments</span>
            <span>{postData.shares} shares</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-2 border-t border-gray-100">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50">
            <Heart className="w-4 h-4" />
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-600 hover:bg-gray-50">
            <Share className="w-4 h-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Linkedin className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">LinkedIn Post Generator</h1>
          </div>
          <p className="text-lg text-gray-600">Create professional LinkedIn posts with realistic engagement</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Author Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Author Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="authorName">Name *</Label>
                    <Input
                      id="authorName"
                      value={postData.authorName}
                      onChange={(e) => updateField('authorName', e.target.value)}
                      placeholder="Enter author name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorTitle">Professional Title</Label>
                    <Input
                      id="authorTitle"
                      value={postData.authorTitle}
                      onChange={(e) => updateField('authorTitle', e.target.value)}
                      placeholder="e.g., Software Engineer at Tech Corp"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="authorImage">Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="authorImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload('profile')}
                      className="flex-1"
                    />
                    {postData.authorImage && (
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={postData.authorImage} />
                        <AvatarFallback>Preview</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Post Content */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Post Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="postText">Post Content *</Label>
                  <Textarea
                    id="postText"
                    value={postData.postText}
                    onChange={(e) => updateField('postText', e.target.value)}
                    placeholder="Write your LinkedIn post content here..."
                    className="h-32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hashtags">Hashtags (comma separated)</Label>
                  <Input
                    id="hashtags"
                    value={postData.hashtags}
                    onChange={(e) => updateField('hashtags', e.target.value)}
                    placeholder="e.g., career, tech, motivation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="postImage">Post Image (Optional)</Label>
                  <Input
                    id="postImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload('post')}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Engagement Settings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-blue-700">Engagement Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="likes">Likes</Label>
                    <Input
                      id="likes"
                      type="number"
                      value={postData.likes}
                      onChange={(e) => updateField('likes', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="comments">Comments</Label>
                    <Input
                      id="comments"
                      type="number"
                      value={postData.comments}
                      onChange={(e) => updateField('comments', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shares">Shares</Label>
                    <Input
                      id="shares"
                      type="number"
                      value={postData.shares}
                      onChange={(e) => updateField('shares', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="timeAgo">Time Posted</Label>
                  <Input
                    id="timeAgo"
                    value={postData.timeAgo}
                    onChange={(e) => updateField('timeAgo', e.target.value)}
                    placeholder="e.g., 1h, 2d, 1w"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleGenerate} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Linkedin className="h-4 w-4 mr-2" />
                Generate LinkedIn Post
              </Button>
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex justify-center">
            {showPreview ? (
              <LinkedInPreview />
            ) : (
              <Card className="shadow-lg h-full flex items-center justify-center w-full">
                <CardContent className="text-center">
                  <Linkedin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">LinkedIn Post Preview</h3>
                  <p className="text-gray-500 mb-4">Fill in the details to see your LinkedIn post preview</p>
                  <Button onClick={() => setShowPreview(true)} variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Enable Preview
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInGenerator;
