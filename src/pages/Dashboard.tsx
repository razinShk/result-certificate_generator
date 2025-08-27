import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { University, Search, FileText, MapPin, Users, Award, BookOpen, Upload, Download, Zap, ArrowRight, CheckCircle, Clock, BarChart3, Archive, Timer, Coffee, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContactForm from '@/components/ContactForm';

interface UniversityData {
  id: string;
  name: string;
  city: string;
  state: string;
  shortName: string;
  color: string;
  description: string;
}

const universities: UniversityData[] = [
  {
    id: 'sppu',
    name: 'Savitribai Phule Pune University',
    city: 'Pune',
    state: 'Maharashtra',
    shortName: 'SPPU',
    color: 'bg-blue-600',
    description: 'Formerly University of Pune'
  },
  {
    id: 'mu',
    name: 'University of Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    shortName: 'MU',
    color: 'bg-purple-600',
    description: 'Premier university in Mumbai'
  },
  {
    id: 'du',
    name: 'University of Delhi',
    city: 'Delhi',
    state: 'Delhi',
    shortName: 'DU',
    color: 'bg-green-600',
    description: 'Central university in Delhi'
  },
  {
    id: 'jnu',
    name: 'Jawaharlal Nehru University',
    city: 'Delhi',
    state: 'Delhi',
    shortName: 'JNU',
    color: 'bg-red-600',
    description: 'Central university, New Delhi'
  },
  {
    id: 'cu',
    name: 'University of Calcutta',
    city: 'Kolkata',
    state: 'West Bengal',
    shortName: 'CU',
    color: 'bg-orange-600',
    description: 'One of India\'s oldest universities'
  },
  {
    id: 'au',
    name: 'Anna University',
    city: 'Chennai',
    state: 'Tamil Nadu',
    shortName: 'AU',
    color: 'bg-teal-600',
    description: 'Technical university in Chennai'
  },
  {
    id: 'impact',
    name: 'Impact School',
    city: 'Lagos',
    state: 'Lagos',
    shortName: 'IMPACT',
    color: 'bg-indigo-600',
    description: 'Premier school for impact-driven education'
  }
];

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contactForm, setContactForm] = useState<{
    isOpen: boolean;
    type: 'university' | 'feedback' | 'report';
    title: string;
  }>({
    isOpen: false,
    type: 'university',
    title: ''
  });
  const [liveCounter, setLiveCounter] = useState(156);
  const [processingTime, setProcessingTime] = useState(47);
  const [hoursSaved, setHoursSaved] = useState(0);
  const [manualHours, setManualHours] = useState(1);
  const [studentsProcessed, setStudentsProcessed] = useState(50);
  const navigate = useNavigate();

  // Animate the live counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => {
        if (prev >= 250) return 156; // Reset to start
        return prev + Math.floor(Math.random() * 3) + 1;
      });
      setProcessingTime(prev => {
        if (prev >= 60) return 47; // Reset to start
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Animate hours saved counter
  useEffect(() => {
    const interval = setInterval(() => {
      setHoursSaved(prev => {
        if (prev >= 1247) return 0; // Reset after reaching max
        return prev + Math.floor(Math.random() * 15) + 5;
      });
      setManualHours(prev => {
        if (prev >= 1250) return 1; // Reset after reaching max
        return prev + Math.floor(Math.random() * 12) + 8;
      });
      setStudentsProcessed(prev => {
        if (prev >= 250) return 50; // Reset after reaching max
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUniversitySelect = (universityId: string) => {
    navigate(`/university/${universityId}`);
  };

  const stats = [
    { label: 'Universities', value: '7+', icon: University, color: 'text-blue-600' },
    { label: 'Bulk Results/Min', value: '500+', icon: Zap, color: 'text-purple-600' },
    { label: 'Active Users', value: '1.2K+', icon: Users, color: 'text-green-600' },
    { label: 'Results Generated', value: '25K+', icon: BarChart3, color: 'text-orange-600' }
  ];

  const openContactForm = (type: 'university' | 'feedback' | 'report') => {
    const titles = {
      university: 'Request New University',
      feedback: 'Send Feedback',
      report: 'Report Issue'
    };
    
    setContactForm({
      isOpen: true,
      type,
      title: titles[type]
    });
  };

  const closeContactForm = () => {
    setContactForm(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Live Demo Hero - Pure Action */}
        <div className="mb-16 pt-8">
          <div className="text-center mb-8 relative">
            <div className="relative inline-block">
              {/* Floating Animation Elements */}
              <div className="absolute -top-4 -left-8 w-6 h-6 bg-green-100 rounded border border-green-300 animate-float opacity-80">
                <div className="text-xs text-green-600 p-1">📊</div>
              </div>
              <div className="absolute -top-2 -right-6 w-5 h-5 bg-blue-100 rounded border border-blue-300 animate-float opacity-70" style={{animationDelay: '1s'}}>
                <div className="text-xs text-blue-600 p-0.5">📄</div>
              </div>
              <div className="absolute -bottom-3 -left-6 w-4 h-4 bg-purple-100 rounded border border-purple-300 animate-float opacity-60" style={{animationDelay: '2s'}}>
                <div className="text-xs text-purple-600">⚡</div>
              </div>
              <div className="absolute -bottom-1 -right-8 w-5 h-5 bg-orange-100 rounded border border-orange-300 animate-float opacity-75" style={{animationDelay: '0.5s'}}>
                <div className="text-xs text-orange-600 p-0.5">📁</div>
              </div>
              
              {/* Processing Flow Animation */}
              <div className="absolute top-1/2 -left-16 transform -translate-y-1/2">
                <div className="flex items-center gap-1 animate-slide-in-left">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-8 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 animate-pulse"></div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -right-16 transform -translate-y-1/2">
                <div className="flex items-center gap-1 animate-slide-in-right">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Sequential Animation: Background Text -> Main Heading */}
              <div className="relative h-32 flex items-center justify-center">
                {/* Step 1: Background text appears first */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-right transform -rotate-12 animate-fade-in-delayed">
                    <div className="space-y-3">
                      <div className="text-4xl font-bold text-blue-600">
                        Save hours of work with
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Main heading appears after background text */}
                <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient relative animate-heading-reveal">
                  Resulty
                </h1>
              </div>
              
              {/* Bulk Processing Indicator */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-200 shadow-sm">
                  <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Bulk Processing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Action Demo */}
          <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-0 shadow-2xl max-w-6xl mx-auto">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                
                {/* Excel Input Animation */}
                <div className="text-center">
                  <div className="bg-green-100 rounded-2xl p-6 mb-4 relative overflow-hidden animate-slide-in-left">
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500 animate-pulse"></div>
                    <Upload className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <div className="text-sm font-semibold text-gray-700 mb-2">students_data.xlsx</div>
                    
                    {/* Animated Excel Preview */}
                    <div className="bg-white rounded-lg p-3 text-xs">
                      <div className="grid grid-cols-3 gap-1 mb-2 font-medium text-gray-600">
                        <div>Name</div>
                        <div>Marks</div>
                        <div>Grade</div>
                      </div>
                      {['John Doe', 'Alice Smith', 'Bob Wilson', '...247 more'].map((name, i) => (
                        <div key={i} className="grid grid-cols-3 gap-1 py-1 border-t text-gray-500" style={{animationDelay: `${i * 0.2}s`}}>
                          <div className="truncate">{name}</div>
                          <div>85</div>
                          <div>A</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-lg font-bold text-green-600">250 Students</div>
                </div>

                {/* Processing Animation */}
                <div className="text-center">
                  <div className="relative">
                    <div className="bg-purple-100 rounded-2xl p-8 animate-pulse-slow">
                      <Zap className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-spin" />
                      <div className="space-y-3">
                        <div className="bg-purple-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                            style={{width: `${(liveCounter / 250) * 100}%`}}
                          ></div>
                        </div>
                        <div className="text-sm font-semibold text-purple-700">Processing...</div>
                        
                        {/* Live Counter */}
                        <div className="bg-white rounded-lg p-3 mt-4">
                          <div className="text-2xl font-bold text-purple-600">{liveCounter}/250</div>
                          <div className="text-xs text-gray-600">Results Generated</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-bold animate-bounce">
                      FAST
                    </div>
                  </div>
                  <div className="text-lg font-bold text-purple-600 mt-2">{processingTime} seconds</div>
                </div>

                {/* PDF Output Animation */}
                <div className="text-center">
                  <div className="bg-blue-100 rounded-2xl p-6 mb-4 animate-slide-in-right">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Download className="h-12 w-12 text-blue-600" />
                      <Archive className="h-12 w-12 text-blue-600" />
                    </div>
                    
                    {/* PDF Stack Animation */}
                    <div className="relative mx-auto w-20 h-16 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className="absolute bg-white border-2 border-blue-300 rounded shadow-sm w-16 h-12"
                          style={{
                            transform: `translateY(-${i * 2}px) translateX(${i * 1}px)`,
                            zIndex: 5 - i,
                            animationDelay: `${i * 0.3}s`
                          }}
                        >
                          <div className="text-xs text-blue-600 p-1">PDF</div>
                        </div>
                      ))}
                    </div>
                    
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white animate-pulse-slow">
                      Download ZIP (15.2 MB)
                    </Button>
                  </div>
                  <div className="text-lg font-bold text-blue-600">250 PDFs Ready</div>
                </div>
              </div>
              
              {/* Live Stats Bar */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-green-600 animate-pulse">98.4%</div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600 animate-pulse">5.3</div>
                    <div className="text-xs text-gray-600">Results/sec</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600 animate-pulse">7</div>
                    <div className="text-xs text-gray-600">Universities</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600 animate-pulse">25K+</div>
                    <div className="text-xs text-gray-600">Generated</div>
                  </div>
                </div>
              </div>

              {/* Dual CTA Buttons */}
              <div className="text-center mt-8 space-y-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse-slow"
                  onClick={() => navigate('/customize-results')}
                >
                  Create for your school
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-12 py-4 text-xl transition-all duration-300"
                    onClick={() => navigate('/report-card-editor')}
                  >
                    <FileText className="h-6 w-6 mr-3" />
                    Create Report Cards
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-12 py-4 text-xl transition-all duration-300"
                    onClick={() => {
                      const universitySection = document.getElementById('university-selection');
                      universitySection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Choose your school
                    <University className="h-6 w-6 ml-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Savings Showcase */}
        <div className="mb-16">
          <Card className="border-0 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden shadow-2xl">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2 h-full">
                
                {/* Manual Work Side */}
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 rounded-full -mr-16 -mt-16 opacity-30"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-400 rounded-full -ml-12 -mb-12 opacity-30"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <AlertTriangle className="h-8 w-8 text-yellow-300 animate-pulse" />
                      <h3 className="text-2xl font-bold">Manual Process</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <Coffee className="h-6 w-6 text-yellow-200 animate-bounce" />
                          <span className="font-semibold">Creating Each Result</span>
                        </div>
                        <div className="text-red-100 text-sm space-y-1">
                          <p>• 15-20 minutes per student</p>
                          <p>• Manual grade calculations</p>
                          <p>• Copy-paste student data</p>
                          <p>• Format each document</p>
                          <p>• Print individually</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2 animate-pulse">
                          {manualHours}
                        </div>
                        <div className="text-red-100 text-lg">
                          Hours for {Math.max(250 - studentsProcessed + 50, 50)} students
                        </div>
                        <div className="text-red-200 text-sm mt-2">
                          ≈ {Math.floor(manualHours / 8)} working days
                        </div>
                      </div>
                      
                      <div className="bg-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-center">
                          <Timer className="h-8 w-8 text-yellow-200 mx-auto mb-2 animate-spin" />
                          <div className="text-sm text-red-100">Still processing...</div>
                          <div className="text-xs text-red-200 mt-1">Only {Math.floor(studentsProcessed / 4)} results done!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resulty Side */}
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-12 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-28 h-28 bg-green-400 rounded-full -ml-14 -mt-14 opacity-30"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-400 rounded-full -mr-16 -mb-16 opacity-30"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
                      <h3 className="text-2xl font-bold">With Resulty</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-green-400/30 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <TrendingUp className="h-6 w-6 text-yellow-200 animate-bounce" />
                          <span className="font-semibold">Bulk Generation</span>
                        </div>
                        <div className="text-green-100 text-sm space-y-1">
                          <p>• Upload Excel file once</p>
                          <p>• Auto grade calculations</p>
                          <p>• Batch processing</p>
                          <p>• Instant formatting</p>
                          <p>• ZIP download ready</p>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent animate-pulse">
                          {Math.floor(manualHours / 60)}
                        </div>
                        <div className="text-green-100 text-lg">
                          Minutes for {studentsProcessed} students
                        </div>
                        <div className="text-green-200 text-sm mt-2">
                          Complete in under 1 hour!
                        </div>
                      </div>
                      
                      <div className="bg-green-400/30 rounded-xl p-4 backdrop-blur-sm">
                        <div className="text-center">
                          <CheckCircle className="h-8 w-8 text-yellow-200 mx-auto mb-2" />
                          <div className="text-sm text-green-100">All {studentsProcessed} Results Ready!</div>
                          <div className="text-xs text-green-200 mt-1">Download ZIP now</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Stats Bar */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
                  <div>
                    <div className="text-3xl font-bold mb-1 animate-pulse">
                      {hoursSaved}+
                    </div>
                    <div className="text-blue-100 text-sm">Hours Saved Today</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1 text-yellow-300">
                      {Math.floor(hoursSaved * 25)}+
                    </div>
                    <div className="text-blue-100 text-sm">Minutes Saved Per School</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1 text-green-300">
                      98.7%
                    </div>
                    <div className="text-blue-100 text-sm">Time Reduction</div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
                    onClick={() => navigate('/customize-results')}
                  >
                    <Clock className="h-5 w-5 mr-2" />
                    Save Your Time Now
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="pt-6 pb-6">
                <div className="relative">
                  <stat.icon className={`h-10 w-10 mx-auto mb-3 ${stat.color} animate-pulse-slow`} style={{animationDelay: `${index * 0.5}s`}} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* University Selection */}
        <div id="university-selection" className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose University Format</h2>
          
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search universities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* University Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredUniversities.map((university, index) => (
            <Card 
              key={university.id} 
              className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer group border-0 bg-white/90 backdrop-blur-sm overflow-hidden animate-slide-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => handleUniversitySelect(university.id)}
            >
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
                <CardHeader className="pb-3 pt-4">
                <div className="flex items-start justify-between">
                    <div className={`w-16 h-16 ${university.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                    <University className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                      <span className="text-xs font-bold text-white bg-green-500 px-2 py-1 rounded-full">BULK READY</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">{university.name}</CardTitle>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3 text-blue-500" />
                    <span>{university.city}</span>
                </div>
              </CardHeader>
                <CardContent className="pt-0">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 py-3 transition-all duration-300 group-hover:shadow-lg">
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Results
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredUniversities.length === 0 && (
          <div className="text-center py-16 animate-slide-in-up">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
          </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No universities found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search terms or browse all available options</p>
            <Button 
              onClick={() => setSearchTerm('')}
              variant="outline" 
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Show All Universities
            </Button>
          </div>
        )}

        {/* Simple Footer */}
        <div className="text-center mt-16 pt-8 pb-8 border-t border-gray-100">
          <div className="flex justify-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => openContactForm('university')}
              className="border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              + Add University
            </Button>
            <Button 
              variant="outline" 
              onClick={() => openContactForm('feedback')}
              className="border-gray-300 hover:bg-gray-50"
            >
              Feedback
            </Button>
          </div>
          <div className="text-gray-400 text-sm">
            © 2024 Resulty
          </div>
        </div>
      </div>

      <ContactForm
        isOpen={contactForm.isOpen}
        onClose={closeContactForm}
        type={contactForm.type}
        title={contactForm.title}
      />
    </div>
  );
};

export default Dashboard;

