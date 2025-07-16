import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { University, Search, FileText, MapPin, Users, Award, BookOpen } from 'lucide-react';
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
  const navigate = useNavigate();

  const filteredUniversities = universities.filter(uni =>
    uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUniversitySelect = (universityId: string) => {
    navigate(`/university/${universityId}`);
  };

  const stats = [
    { label: 'Universities', value: '7', icon: University, color: 'text-blue-600' },
    { label: 'Result Formats', value: '6', icon: FileText, color: 'text-green-600' },
    { label: 'Active Users', value: '1.2K+', icon: Users, color: 'text-purple-600' },
    { label: 'Results Generated', value: '15K+', icon: Award, color: 'text-orange-600' }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <University className="h-12 w-12 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">University Result Creator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional exam result sheets for various universities across India. 
            Select your university to get started with the customized result format.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Section */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <BookOpen className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Multiple Universities</h3>
                <p className="text-sm text-gray-600">Support for 6+ major Indian universities with authentic formats</p>
              </div>
              <div className="text-center">
                <FileText className="h-10 w-10 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Preview</h3>
                <p className="text-sm text-gray-600">See your result sheet update in real-time as you type</p>
              </div>
              <div className="text-center">
                <Award className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Auto Calculations</h3>
                <p className="text-sm text-gray-600">Automatic grade calculation and SGPA computation</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search universities by name, city, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        {/* University Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredUniversities.map((university) => (
            <Card 
              key={university.id} 
              className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => handleUniversitySelect(university.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-16 h-16 ${university.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <University className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-500">{university.shortName}</span>
                    <div className="text-xs text-gray-400 mt-1">Format Available</div>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{university.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-3">{university.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span>{university.city}, {university.state}</span>
                </div>
                <Button className="w-full group-hover:bg-primary/90 transition-colors" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Result Sheet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <University className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No universities found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">
            More universities coming soon! Contact us to add your university's result format.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openContactForm('university')}
            >
              Request New University
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openContactForm('report')}
            >
              Report Issue
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => openContactForm('feedback')}
            >
              Feedback
            </Button>
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
