
import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, Instagram, Upload, Heart, MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InstagramGenerator = () => {
  const [formData, setFormData] = useState({
    senderName: 'john_doe',
    receiverName: 'You',
    message: 'Hey! Check out this amazing photo 📸',
    time: '2h',
    isVerified: false,
    isReceived: false
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your Instagram DM screenshot is being generated...",
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
            <Instagram className="h-10 w-10 text-pink-600" />
            Instagram DM Generator
          </h1>
          <p className="text-xl text-gray-600">Create realistic Instagram DM screenshots</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>DM Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senderName">Sender Username</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="receiverName">Receiver Username</Label>
                <Input
                  id="receiverName"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({...formData, receiverName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
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
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({...formData, isVerified: e.target.checked})}
                />
                <Label htmlFor="verified">Verified Account</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isReceived"
                  checked={formData.isReceived}
                  onChange={(e) => setFormData({...formData, isReceived: e.target.checked})}
                />
                <Label htmlFor="isReceived">Show as Received Message</Label>
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
              <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 max-w-sm mx-auto">
                {/* Instagram Header */}
                <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6">
                      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        {profilePhoto ? (
                          <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-300"></div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1">
                        {formData.senderName}
                        {formData.isVerified && <span className="text-blue-500 text-xs">✓</span>}
                      </div>
                      <div className="text-xs text-gray-500">Active now</div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-600">
                    <MessageCircle className="w-6 h-6" />
                    <div className="w-6 h-6">ℹ️</div>
                  </div>
                </div>
                
                {/* Chat Area */}
                <div className="bg-white p-4 min-h-[400px]">
                  <div className={`flex mb-4 ${formData.isReceived ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs px-4 py-2 rounded-full ${
                      formData.isReceived 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      <div className="text-sm">{formData.message}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 text-center mb-4">{formData.time}</div>
                </div>
                
                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 border border-gray-300 rounded-full px-4 py-2 flex items-center gap-3">
                    <span className="text-gray-400">💙</span>
                    <span className="text-sm text-gray-500 flex-1">Message...</span>
                  </div>
                  <Send className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstagramGenerator;
