import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft,
  Upload,
  FileImage,
  Wand2,
  CheckCircle,
  Zap,
  Download,
  Eye,
  Settings,
  Palette,
  FileText,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  MessageCircle,
  Phone
} from 'lucide-react';
import { toast } from 'sonner';

const CustomizeResults = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [customizationData, setCustomizationData] = useState({
    schoolName: '',
    logoUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Inter',
    layout: 'modern',
    includeQR: true,
    includeSignature: true,
    watermarkText: ''
  });

  const steps = [
    {
      id: 1,
      title: 'Upload Template',
      description: 'Upload your school\'s report card template',
      icon: Upload,
      color: 'from-green-500 to-emerald-600',
      completed: !!uploadedFile
    },
    {
      id: 2,
      title: 'Customize Design',
      description: 'Personalize colors, fonts, and layout',
      icon: Palette,
      color: 'from-purple-500 to-violet-600',
      completed: customizationData.schoolName !== ''
    },
    {
      id: 3,
      title: 'AI Processing',
      description: 'Our AI analyzes and recreates your format',
      icon: Wand2,
      color: 'from-blue-500 to-cyan-600',
      completed: false
    },
    {
      id: 4,
      title: 'Bulk Ready',
      description: 'Your custom format is ready for bulk generation',
      icon: Users,
      color: 'from-orange-500 to-red-600',
      completed: false
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setCurrentStep(1);
      toast.success('Template uploaded successfully!');
    }
  };

  const handleCustomizationChange = (field: string, value: string | boolean) => {
    setCustomizationData(prev => ({ ...prev, [field]: value }));
    if (currentStep < 2) setCurrentStep(2);
  };

  const startProcessing = () => {
    if (!uploadedFile || !customizationData.schoolName) {
      toast.error('Please upload a template and enter school details');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(2);

    // Simulate AI processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep(3);
      toast.success('Template processed successfully!');
    }, 3000);
  };

  const completeSetup = () => {
    setCurrentStep(3);
    toast.success('Your custom result format is ready!');
  };

  const startAutoPlay = () => {
    setIsPlaying(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step >= steps.length) {
        clearInterval(interval);
        setIsPlaying(false);
        return;
      }
      setCurrentStep(step);
    }, 2500);

    return () => clearInterval(interval);
  };

  const stopAutoPlay = () => {
    setIsPlaying(false);
  };

  const resetProcess = () => {
    setCurrentStep(0);
    setUploadedFile(null);
    setIsProcessing(false);
    setIsPreviewMode(false);
    setCustomizationData({
      schoolName: '',
      logoUrl: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
      fontFamily: 'Inter',
      layout: 'modern',
      includeQR: true,
      includeSignature: true,
      watermarkText: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="absolute top-2 left-20 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-40"></div>
        <div className="absolute top-4 right-32 w-1.5 h-1.5 bg-purple-400 rounded-full animate-float opacity-35" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-3 left-1/3 w-1 h-1 bg-green-400 rounded-full animate-float opacity-30" style={{animationDelay: '2s'}}></div>

        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="group flex items-center gap-2 hover:bg-blue-50 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
              </Button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Resulty Customizer
                  </h1>
                  <p className="text-sm text-gray-600">Design Your School's Result Format</p>
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={resetProcess}
                className="hover:bg-red-50 hover:border-red-300"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={isPlaying ? stopAutoPlay : startAutoPlay}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Auto Demo
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === index;
              const isCompleted = step.completed || currentStep > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`relative group`}>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg transition-all duration-500 ${
                      isActive ? 'scale-110 shadow-2xl' : 'hover:scale-105'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-8 w-8 text-white" />
                      ) : (
                        <IconComponent className={`h-8 w-8 text-white ${isActive ? 'animate-pulse' : ''}`} />
                      )}
                    </div>

                    {/* Floating particles */}
                    {isActive && (
                      <>
                        <div className="absolute -top-2 -right-2 w-2 h-2 bg-white rounded-full animate-ping opacity-75"></div>
                        <div className="absolute -bottom-2 -left-2 w-1.5 h-1.5 bg-white rounded-full animate-ping opacity-60" style={{animationDelay: '0.5s'}}></div>
                      </>
                    )}

                    {/* Step info on hover */}
                    <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-gray-300">{step.description}</div>
                      </div>
                    </div>
                  </div>

                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${
                      isCompleted ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-300'
                    }`}>
                      {isCompleted && <div className="w-full h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse"></div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Current Step Description */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
            <p className="text-gray-600">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Left Panel - Interactive Form */}
          <div className="space-y-6">

            {/* Sample Report Cards Gallery */}
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-purple-50 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-center">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
                  </div>
                  <span className="text-lg">Colorful Sample Designs</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.8s'}}></div>
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">

                  {/* Sample 1 - Rainbow Theme */}
                  <div className="group relative bg-gradient-to-r from-red-400 to-purple-600 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400/50 via-blue-400/50 to-cyan-400/50 rounded-xl"></div>
                    {/* Animated background particles */}
                    <div className="absolute inset-0">
                      <div className="absolute top-2 left-4 w-2 h-2 bg-white rounded-full animate-float opacity-60"></div>
                      <div className="absolute top-6 right-6 w-1.5 h-1.5 bg-white rounded-full animate-float opacity-50" style={{animationDelay: '1s'}}></div>
                      <div className="absolute bottom-4 left-1/2 w-1 h-1 bg-white rounded-full animate-float opacity-40" style={{animationDelay: '2s'}}></div>
                      <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full animate-ping opacity-70" style={{animationDelay: '0.5s'}}></div>
                    </div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">🌈 Rainbow Academy</div>
                        <div className="text-sm text-white/90 font-medium">Academic Year 2024-25</div>
                      </div>

                      {/* Student Info */}
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-white font-medium">👦 Alex Johnson</div>
                          <div className="text-white/90">Grade: 3rd A</div>
                          <div className="text-white font-medium">📚 Roll No: 2024001</div>
                          <div className="text-white/90">March 2024</div>
                        </div>
                      </div>

                      {/* Colorful Marks Table */}
                      <div className="space-y-1">
                        {[
                          { subject: '🎨 Art', marks: 95, grade: 'A+', color: 'bg-pink-500' },
                          { subject: '🎵 Music', marks: 92, grade: 'A', color: 'bg-purple-500' },
                          { subject: '📖 English', marks: 88, grade: 'A', color: 'bg-blue-500' },
                          { subject: '🔢 Math', marks: 90, grade: 'A', color: 'bg-green-500' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/15 rounded-lg p-2 text-xs">
                            <span className="text-white font-medium">{item.subject}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{item.marks}</span>
                              <span className={`px-2 py-0.5 rounded-full text-white font-bold text-xs ${item.color}`}>
                                {item.grade}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer with emoji */}
                      <div className="text-center mt-3">
                        <div className="text-lg">⭐ Principal's Signature ⭐</div>
                        <div className="mt-1 text-sm text-white/80">Keep shining bright! 🌟</div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                  {/* Sample 2 - Ocean Theme */}
                  <div className="group relative bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer overflow-hidden">
                    {/* Animated wave particles */}
                    <div className="absolute inset-0">
                      <div className="absolute top-3 left-3 w-3 h-3 bg-white rounded-full animate-bounce opacity-40"></div>
                      <div className="absolute top-8 right-8 w-2 h-2 bg-cyan-200 rounded-full animate-bounce opacity-50" style={{animationDelay: '0.8s'}}></div>
                      <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-blue-200 rounded-full animate-bounce opacity-60" style={{animationDelay: '1.6s'}}></div>
                      <div className="absolute bottom-3 right-4 w-2 h-2 bg-indigo-200 rounded-full animate-ping opacity-70" style={{animationDelay: '2.4s'}}></div>
                    </div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="text-center mb-3">
                        <div className="text-2xl font-bold text-white mb-1 drop-shadow-lg">🌊 Ocean Kids School</div>
                        <div className="text-sm text-white/90 font-medium">Term 1 Report</div>
                      </div>

                      {/* Student Info */}
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-white font-medium">👧 Emma Davis</div>
                          <div className="text-white/90">Grade: 2nd B</div>
                          <div className="text-white font-medium">🧜 Roll No: 2024056</div>
                          <div className="text-white/90">April 2024</div>
                        </div>
                      </div>

                      {/* Ocean themed marks */}
                      <div className="space-y-1">
                        {[
                          { subject: '🐠 Science', marks: 87, grade: 'A-', color: 'bg-cyan-500' },
                          { subject: '📝 Writing', marks: 93, grade: 'A', color: 'bg-blue-500' },
                          { subject: '🧮 Numbers', marks: 85, grade: 'A-', color: 'bg-indigo-500' },
                          { subject: '🎭 Drama', marks: 96, grade: 'A+', color: 'bg-purple-500' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white/15 rounded-lg p-2 text-xs">
                            <span className="text-white font-medium">{item.subject}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold">{item.marks}</span>
                              <span className={`px-2 py-0.5 rounded-full text-white font-bold text-xs ${item.color}`}>
                                {item.grade}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer with ocean theme */}
                      <div className="text-center mt-3">
                        <div className="text-lg">🏆 Director's Approval 🏆</div>
                        <div className="mt-1 text-sm text-white/80">Swim to success! 🐋</div>
                      </div>
                    </div>

                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  </div>

                </div>

                {/* Sample description */}
                <div className="mt-4 p-3 bg-white/50 rounded-lg text-center">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-purple-600">✨ Inspired Designs:</span> These colorful samples show how we transform
                    boring reports into engaging, child-friendly designs that celebrate learning!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: File Upload */}
            <Card className={`border-2 transition-all duration-500 ${
              currentStep === 0 ? 'border-green-300 shadow-lg shadow-green-100' : 'border-gray-200'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${steps[0].color} flex items-center justify-center`}>
                    <Upload className="h-4 w-4 text-white" />
                  </div>
                  Step 1: Upload Your School Template
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Upload your school's report card template (PNG, JPG, PDF)</p>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="template-upload"
                  />
                  <label htmlFor="template-upload">
                    <Button variant="outline" className="cursor-pointer" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Template File
                      </span>
                    </Button>
                  </label>
                  {uploadedFile && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">{uploadedFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Customization */}
            <Card className={`border-2 transition-all duration-500 ${
              currentStep === 1 ? 'border-purple-300 shadow-lg shadow-purple-100' : 'border-gray-200'
            }`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${steps[1].color} flex items-center justify-center`}>
                    <Palette className="h-4 w-4 text-white" />
                  </div>
                  Step 2: Customize Your Design
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      placeholder="Enter your school name"
                      value={customizationData.schoolName}
                      onChange={(e) => handleCustomizationChange('schoolName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoUrl">Logo URL (Optional)</Label>
                    <Input
                      id="logoUrl"
                      placeholder="https://..."
                      value={customizationData.logoUrl}
                      onChange={(e) => handleCustomizationChange('logoUrl', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={customizationData.primaryColor}
                        onChange={(e) => handleCustomizationChange('primaryColor', e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={customizationData.primaryColor}
                        onChange={(e) => handleCustomizationChange('primaryColor', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="fontFamily">Font Family</Label>
                    <select
                      value={customizationData.fontFamily}
                      onChange={(e) => handleCustomizationChange('fontFamily', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Arial">Arial</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Additional Features</Label>
                  <div className="flex flex-wrap gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customizationData.includeQR}
                        onChange={(e) => handleCustomizationChange('includeQR', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Include QR Code</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customizationData.includeSignature}
                        onChange={(e) => handleCustomizationChange('includeSignature', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Digital Signature</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="watermark">Watermark Text (Optional)</Label>
                  <Input
                    id="watermark"
                    placeholder="e.g., CONFIDENTIAL"
                    value={customizationData.watermarkText}
                    onChange={(e) => handleCustomizationChange('watermarkText', e.target.value)}
                  />
                </div>

                {/* Professional Design Service */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 relative overflow-hidden animate-slide-in-up" style={{animationDelay: '0.5s'}}>
                  {/* Floating background elements */}
                  <div className="absolute top-2 right-2 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
                  <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-30" style={{animationDelay: '1s'}}></div>

                  <div className="text-center mb-4 relative">
                    <div className="relative inline-block">
                      <Sparkles className="h-8 w-8 text-blue-600 mx-auto mb-2 animate-pulse" />
                      {/* Sparkle particles */}
                      <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-400 rounded-full animate-ping opacity-60"></div>
                      <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-50" style={{animationDelay: '0.8s'}}></div>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">We Design Your Report Card For You!</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Don't have a template? Our professional designers will create a custom report card format
                      that matches your school's branding and requirements perfectly.
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-4">Get in touch for custom design services</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="group relative bg-green-50 border-green-300 hover:bg-green-100 hover:border-green-400 text-green-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => window.open('https://wa.me/9665448256', '_blank')}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp Us
                        {/* Click ripple effect */}
                        <div className="absolute inset-0 rounded opacity-0 group-active:opacity-20 group-active:bg-green-500 group-active:animate-ping transition-all duration-200"></div>
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="group relative bg-blue-50 border-blue-300 hover:bg-blue-100 hover:border-blue-400 text-blue-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
                        onClick={() => window.open('tel:+9665448256', '_self')}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Now
                        {/* Click ripple effect */}
                        <div className="absolute inset-0 rounded opacity-0 group-active:opacity-20 group-active:bg-blue-500 group-active:animate-ping transition-all duration-200"></div>
                      </Button>
                    </div>

                    <div className="mt-3 text-xs text-gray-400 flex justify-center gap-2">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        Professional design
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-blue-500" />
                        Fast turnaround
                      </span>
                      <span className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-500" />
                        Custom branding
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={startProcessing}
                disabled={!uploadedFile || !customizationData.schoolName || isProcessing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Process Template
                  </>
                )}
              </Button>

              <Button
                onClick={completeSetup}
                disabled={currentStep < 2}
                variant="outline"
                className="hover:bg-green-50 hover:border-green-300"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Setup
              </Button>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="space-y-6">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    Live Preview
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    {isPreviewMode ? 'Exit Preview' : 'Full Preview'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!uploadedFile ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload a template to see the preview</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Sample Result Card */}
                    <div className="border rounded-lg p-6 bg-white shadow-sm">
                      {/* Header */}
                      <div className="text-center mb-6">
                        {customizationData.logoUrl && (
                          <img src={customizationData.logoUrl} alt="School Logo" className="h-12 mx-auto mb-4" />
                        )}
                        <h3 className="text-xl font-bold" style={{color: customizationData.primaryColor}}>
                          {customizationData.schoolName || 'Your School Name'}
                        </h3>
                        <p className="text-sm text-gray-600">Academic Year 2024-25</p>
                      </div>

                      {/* Student Info */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-gray-600">Student Name:</p>
                          <p className="font-medium">John Doe</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Grade:</p>
                          <p className="font-medium">10th A</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Roll Number:</p>
                          <p className="font-medium">2024001</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date:</p>
                          <p className="font-medium">March 15, 2024</p>
                        </div>
                      </div>

                      {/* Marks Table */}
                      <div className="mb-6">
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{backgroundColor: customizationData.primaryColor}}>
                              <th className="p-2 text-left text-white rounded-tl">Subject</th>
                              <th className="p-2 text-center text-white">Marks</th>
                              <th className="p-2 text-center text-white rounded-tr">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {['Mathematics', 'Science', 'English', 'History'].map((subject, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{subject}</td>
                                <td className="p-2 text-center">95</td>
                                <td className="p-2 text-center font-bold">A+</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-end">
                        <div>
                          {customizationData.includeSignature && (
                            <div className="border-t border-gray-300 pt-2">
                              <p className="text-xs text-gray-600">Principal's Signature</p>
                              <div className="w-24 h-8 border-b border-gray-400 mt-1"></div>
                            </div>
                          )}
                        </div>
                        <div>
                          {customizationData.includeQR && (
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                              <div className="w-8 h-8 bg-black"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Processing Animation */}
                    {isProcessing && (
                      <div className="text-center py-8">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                        <p className="text-gray-600">AI is analyzing your template...</p>
                        <div className="flex justify-center gap-2 mt-4">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
                          <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-green-600 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    )}

                    {/* Success Message */}
                    {currentStep >= 3 && (
                      <div className="text-center py-8 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-green-800 mb-2">Template Ready!</h3>
                        <p className="text-green-600">Your custom result format is now ready for bulk generation</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bulk Generation Ready */}
            {currentStep >= 3 && (
              <Card className="border-2 border-green-300 shadow-lg shadow-green-100">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready for Bulk Generation!</h3>
                    <p className="text-gray-600 mb-6">Your custom template can now process hundreds of results instantly</p>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">500+</div>
                        <div className="text-xs text-gray-600">Results/min</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">100%</div>
                        <div className="text-xs text-gray-600">Auto-formatted</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">ZIP</div>
                        <div className="text-xs text-gray-600">Download</div>
                      </div>
                    </div>

                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                      onClick={() => navigate('/university/sppu')}
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Start Bulk Generation
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeResults;
