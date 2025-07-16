
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Download, Eye, Palette, Calendar, User, FileText, Star, Trophy, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface CertificateData {
  recipientName: string;
  title: string;
  description: string;
  issuer: string;
  date: string;
  template: string;
  signatory: string;
  signatoryTitle: string;
  signatureFont: string;
}

const CertificateGenerator = () => {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    recipientName: '',
    title: '',
    description: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    template: 'classic',
    signatory: '',
    signatoryTitle: '',
    signatureFont: 'alex-brush'
  });

  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    { 
      value: 'classic', 
      label: 'Classic Certificate', 
      color: 'bg-blue-600',
      theme: 'traditional',
      pattern: 'formal'
    },
    { 
      value: 'modern', 
      label: 'Modern Design', 
      color: 'bg-purple-600',
      theme: 'contemporary',
      pattern: 'minimal'
    },
    { 
      value: 'elegant', 
      label: 'Elegant Style', 
      color: 'bg-green-600',
      theme: 'sophisticated',
      pattern: 'ornate'
    },
    { 
      value: 'achievement', 
      label: 'Achievement Award', 
      color: 'bg-orange-600',
      theme: 'bold',
      pattern: 'dynamic'
    },
    { 
      value: 'completion', 
      label: 'Course Completion', 
      color: 'bg-teal-600',
      theme: 'academic',
      pattern: 'structured'
    },
    { 
      value: 'appreciation', 
      label: 'Appreciation Certificate', 
      color: 'bg-red-600',
      theme: 'warm',
      pattern: 'friendly'
    }
  ];

  const signatureFonts = [
    { value: 'alex-brush', label: 'Alex Brush' },
    { value: 'dancing', label: 'Dancing Script' },
    { value: 'segoe', label: 'Segoe Script' }
  ];

  const updateField = (field: keyof CertificateData, value: string) => {
    setCertificateData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = () => {
    if (!certificateData.recipientName || !certificateData.title) {
      toast.error('Please fill in recipient name and certificate title');
      return;
    }
    setShowPreview(true);
    toast.success('Certificate generated successfully!');
  };

  const handleDownload = () => {
    toast.info('Certificate download feature coming soon!');
  };

  const CertificatePreview = () => {
    const selectedTemplate = templates.find(t => t.value === certificateData.template);
    const signatureFont = `font-${certificateData.signatureFont}`;
    
    // Template-specific designs
    const getTemplateDesign = () => {
      switch (certificateData.template) {
        case 'classic':
          return {
            container: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-8 border-blue-800',
            header: 'text-blue-900',
            accent: 'bg-blue-800',
            decorative: 'text-blue-200',
            corners: 'border-blue-800',
            pattern: (
              <>
                <div className="absolute top-4 left-4 w-16 h-16 border-4 border-blue-300 rounded-full opacity-20"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-4 border-blue-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-4 border-blue-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-4 border-blue-300 rounded-full opacity-20"></div>
              </>
            )
          };
        case 'modern':
          return {
            container: 'bg-gradient-to-r from-purple-100 via-white to-purple-100 border-l-8 border-r-8 border-purple-600',
            header: 'text-purple-900',
            accent: 'bg-purple-600',
            decorative: 'text-purple-200',
            corners: 'border-purple-600',
            pattern: (
              <>
                <div className="absolute top-0 left-1/4 w-2 h-full bg-purple-200 opacity-30"></div>
                <div className="absolute top-0 right-1/4 w-2 h-full bg-purple-200 opacity-30"></div>
                <div className="absolute top-1/4 left-0 w-full h-2 bg-purple-200 opacity-30"></div>
                <div className="absolute bottom-1/4 left-0 w-full h-2 bg-purple-200 opacity-30"></div>
              </>
            )
          };
        case 'elegant':
          return {
            container: 'bg-gradient-to-br from-emerald-50 to-green-100 border-4 border-green-700',
            header: 'text-green-900',
            accent: 'bg-green-700',
            decorative: 'text-green-200',
            corners: 'border-green-700',
            pattern: (
              <>
                <div className="absolute inset-4 border-2 border-green-300 opacity-40"></div>
                <div className="absolute inset-8 border border-green-300 opacity-30"></div>
                <div className="absolute top-8 left-8 right-8 h-px bg-green-300 opacity-50"></div>
                <div className="absolute bottom-8 left-8 right-8 h-px bg-green-300 opacity-50"></div>
              </>
            )
          };
        case 'achievement':
          return {
            container: 'bg-gradient-to-br from-orange-50 to-yellow-100 border-6 border-orange-600',
            header: 'text-orange-900',
            accent: 'bg-orange-600',
            decorative: 'text-orange-200',
            corners: 'border-orange-600',
            pattern: (
              <>
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                  <Star className="h-8 w-8 text-orange-300 opacity-60" />
                </div>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <Trophy className="h-8 w-8 text-orange-300 opacity-60" />
                </div>
                <div className="absolute top-1/2 left-6 transform -translate-y-1/2">
                  <Award className="h-6 w-6 text-orange-300 opacity-60" />
                </div>
                <div className="absolute top-1/2 right-6 transform -translate-y-1/2">
                  <Award className="h-6 w-6 text-orange-300 opacity-60" />
                </div>
              </>
            )
          };
        case 'completion':
          return {
            container: 'bg-gradient-to-br from-teal-50 to-cyan-100 border-4 border-teal-700',
            header: 'text-teal-900',
            accent: 'bg-teal-700',
            decorative: 'text-teal-200',
            corners: 'border-teal-700',
            pattern: (
              <>
                <div className="absolute top-0 left-0 w-32 h-32 border-r-4 border-b-4 border-teal-300 opacity-40"></div>
                <div className="absolute top-0 right-0 w-32 h-32 border-l-4 border-b-4 border-teal-300 opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-r-4 border-t-4 border-teal-300 opacity-40"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-l-4 border-t-4 border-teal-300 opacity-40"></div>
              </>
            )
          };
        case 'appreciation':
          return {
            container: 'bg-gradient-to-br from-red-50 to-pink-100 border-6 border-red-600',
            header: 'text-red-900',
            accent: 'bg-red-600',
            decorative: 'text-red-200',
            corners: 'border-red-600',
            pattern: (
              <>
                <div className="absolute top-8 left-8">
                  <Heart className="h-6 w-6 text-red-300 opacity-60" />
                </div>
                <div className="absolute top-8 right-8">
                  <Heart className="h-6 w-6 text-red-300 opacity-60" />
                </div>
                <div className="absolute bottom-8 left-8">
                  <Heart className="h-6 w-6 text-red-300 opacity-60" />
                </div>
                <div className="absolute bottom-8 right-8">
                  <Heart className="h-6 w-6 text-red-300 opacity-60" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
                  <Heart className="h-32 w-32 text-red-300" />
                </div>
              </>
            )
          };
        default:
          return {
            container: 'bg-white border-4 border-gray-300',
            header: 'text-gray-800',
            accent: 'bg-gray-600',
            decorative: 'text-gray-200',
            corners: 'border-gray-300',
            pattern: null
          };
      }
    };

    const design = getTemplateDesign();
    
    return (
      <div className={`p-8 rounded-lg shadow-2xl relative overflow-hidden min-h-[600px] ${design.container}`}>
        {/* Template-specific patterns */}
        {design.pattern}

        {/* Decorative corners */}
        <div className={`absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 ${design.corners}`}></div>
        <div className={`absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 ${design.corners}`}></div>
        <div className={`absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 ${design.corners}`}></div>
        <div className={`absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 ${design.corners}`}></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className={`w-20 h-20 ${selectedTemplate?.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
            <Award className="h-10 w-10 text-white" />
          </div>
          <h1 className={`text-4xl font-bold ${design.header} mb-2`}>CERTIFICATE</h1>
          <div className={`w-32 h-1 ${design.accent} mx-auto`}></div>
        </div>

        {/* Content */}
        <div className="text-center space-y-6 relative z-10">
          <p className="text-lg text-gray-600">This is to certify that</p>
          
          <h2 className={`text-3xl font-bold ${design.header} border-b-2 border-opacity-30 pb-2`} style={{borderColor: selectedTemplate?.color.replace('bg-', '')}}>
            {certificateData.recipientName || 'RECIPIENT NAME'}
          </h2>
          
          <p className="text-lg text-gray-600">has successfully</p>
          
          <h3 className={`text-2xl font-semibold ${design.header}`}>
            {certificateData.title || 'CERTIFICATE TITLE'}
          </h3>
          
          {certificateData.description && (
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {certificateData.description}
            </p>
          )}
          
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-300 border-opacity-50">
            <div className="text-left">
              <p className="text-sm text-gray-500">Date of Issue</p>
              <p className="font-semibold text-gray-800">
                {new Date(certificateData.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-40 h-16 mb-2 flex items-end justify-center">
                <div className={`text-2xl ${signatureFont} text-gray-700`}>
                  {certificateData.signatory || 'Authorized Signatory'}
                </div>
              </div>
              <div className="w-40 h-px bg-gray-400 mb-2"></div>
              <p className="font-semibold text-gray-800">{certificateData.signatory || 'Authorized Signatory'}</p>
              <p className="text-sm text-gray-600">{certificateData.signatoryTitle || 'Title'}</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Issued by</p>
              <p className="font-semibold text-gray-800">{certificateData.issuer || 'Organization'}</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${design.decorative} opacity-30`}>
          <Award className="h-32 w-32" />
        </div>
        <div className={`absolute top-1/2 right-4 transform -translate-y-1/2 ${design.decorative} opacity-30`}>
          <Award className="h-32 w-32" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="h-8 w-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Certificate Generator</h1>
          </div>
          <p className="text-lg text-gray-600">Create professional certificates and awards instantly</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            {/* Template Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-orange-700 flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Certificate Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        certificateData.template === template.value
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => updateField('template', template.value)}
                    >
                      <div className={`w-8 h-8 ${template.color} rounded mb-2`}></div>
                      <p className="text-sm font-medium">{template.label}</p>
                      <p className="text-xs text-gray-500 capitalize">{template.theme}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Certificate Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-orange-700 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Certificate Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="recipientName">Recipient Name *</Label>
                  <Input
                    id="recipientName"
                    value={certificateData.recipientName}
                    onChange={(e) => updateField('recipientName', e.target.value)}
                    placeholder="Enter recipient's full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="title">Certificate Title *</Label>
                  <Input
                    id="title"
                    value={certificateData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g., Course Completion, Achievement Award"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={certificateData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Brief description of the achievement or course"
                    className="h-20"
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issuer">Issuing Organization</Label>
                    <Input
                      id="issuer"
                      value={certificateData.issuer}
                      onChange={(e) => updateField('issuer', e.target.value)}
                      placeholder="Organization name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Issue Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={certificateData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="signatory">Signatory Name</Label>
                    <Input
                      id="signatory"
                      value={certificateData.signatory}
                      onChange={(e) => updateField('signatory', e.target.value)}
                      placeholder="Name of person signing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signatoryTitle">Signatory Title</Label>
                    <Input
                      id="signatoryTitle"
                      value={certificateData.signatoryTitle}
                      onChange={(e) => updateField('signatoryTitle', e.target.value)}
                      placeholder="e.g., Director, Manager"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="signatureFont">Signature Font</Label>
                  <Select value={certificateData.signatureFont} onValueChange={(value) => updateField('signatureFont', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {signatureFonts.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span className={`font-${font.value}`}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleGenerate} className="flex-1 bg-orange-600 hover:bg-orange-700">
                <Award className="h-4 w-4 mr-2" />
                Generate Certificate
              </Button>
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              {showPreview && (
                <Button onClick={handleDownload} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div>
            {showPreview ? (
              <CertificatePreview />
            ) : (
              <Card className="shadow-lg h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Certificate Preview</h3>
                  <p className="text-gray-500 mb-4">Fill in the details and click "Generate" to see your certificate</p>
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

export default CertificateGenerator;
