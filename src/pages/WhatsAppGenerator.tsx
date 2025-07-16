import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, MessageCircle, Upload, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handlePrint } from '@/utils/printUtils';

const WhatsAppGenerator = () => {
  const [formData, setFormData] = useState({
    senderName: 'John Doe',
    receiverName: 'You',
    message: 'Hey! How are you doing?',
    time: '12:30 PM',
    status: 'delivered' as 'sent' | 'delivered' | 'read',
    isReceived: false
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDownload = () => {
    handlePrint('whatsapp-preview');
    toast({
      title: "Download Started",
      description: "Your WhatsApp chat screenshot is being generated...",
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
            <MessageCircle className="h-10 w-10 text-green-600" />
            WhatsApp Chat Generator
          </h1>
          <p className="text-xl text-gray-600">Create realistic WhatsApp chat screenshots</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Chat Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={formData.senderName}
                  onChange={(e) => setFormData({...formData, senderName: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="receiverName">Receiver Name</Label>
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
              
              <div>
                <Label htmlFor="status">Message Status</Label>
                <select
                  id="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="read">Read</option>
                </select>
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
              
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Screenshot
                </Button>
                <Button onClick={() => handlePrint('whatsapp-preview')} variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div id="whatsapp-preview" className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 max-w-sm mx-auto">
                {/* WhatsApp Header */}
                <div className="bg-green-600 px-4 py-3 flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
                    {profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-400"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{formData.senderName}</div>
                    <div className="text-xs opacity-90">online</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-6 h-6">📹</div>
                    <div className="w-6 h-6">📞</div>
                    <div className="w-6 h-6">⋮</div>
                  </div>
                </div>
                
                {/* Chat Area */}
                <div className="bg-[#e5ddd5] p-4 min-h-[400px] relative" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}>
                  {/* Messages */}
                  <div className={`flex mb-4 ${formData.isReceived ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg shadow-sm ${
                      formData.isReceived 
                        ? 'bg-white text-gray-800' 
                        : 'bg-green-500 text-white'
                    }`}>
                      <div className="text-sm leading-relaxed">{formData.message}</div>
                      <div className={`text-xs mt-1 flex items-center gap-1 ${
                        formData.isReceived ? 'text-gray-500' : 'text-green-100'
                      }`}>
                        <span>{formData.time}</span>
                        {!formData.isReceived && (
                          <span className="ml-1">
                            {formData.status === 'read' && (
                              <span className="text-blue-200">✓✓</span>
                            )}
                            {formData.status === 'delivered' && (
                              <span className="text-gray-300">✓✓</span>
                            )}
                            {formData.status === 'sent' && (
                              <span className="text-gray-300">✓</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Input Area */}
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-3">
                  <div className="text-gray-400">😊</div>
                  <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-gray-500">
                    Type a message
                  </div>
                  <div className="text-gray-400">📎</div>
                  <div className="text-gray-400">🎤</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGenerator;
